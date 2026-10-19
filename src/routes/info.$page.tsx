import { createFileRoute, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ReportDialog } from "@/components/ReportDialog";

const PAGES: Record<string, { title: string; body: string }> = {
  about: { title: "About ParkShare India", body: "ParkShare India is a college project prototype for peer-to-peer parking in Indian metros, connecting drivers with homeowners who have unused spaces." },
  contact: { title: "Contact", body: "Email hello@parkshare.example (demo address). Use the form below to send us a message, stored as a demo record." },
  support: { title: "Support", body: "Having trouble with a booking or listing? Send us the details and we'll help. Reports are saved as demo records in this prototype." },
  privacy: { title: "Privacy", body: "Identity documents are never shared with parking owners. In this prototype, no real identity data is collected; all data stays on your device." },
  terms: { title: "Terms", body: "This prototype is for demonstration only. Listings, bookings, payments and verifications are simulated and carry no legal or financial effect." },
};

export const Route = createFileRoute("/info/$page")({
  loader: ({ params }) => { const p = PAGES[params.page]; if (!p) throw notFound(); return p; },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Info"} — ParkShare India` },
      { name: "description", content: loaderData?.body.slice(0, 150) ?? "ParkShare India" },
      { property: "og:title", content: `${loaderData?.title ?? "Info"} — ParkShare India` },
      { property: "og:description", content: loaderData?.body.slice(0, 150) ?? "ParkShare India" },
    ],
  }),
  component: Info,
});

function Info() {
  const p = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">{p.title}</h1>
      <p className="mt-4 text-muted-foreground">{p.body}</p>
      <ReportDialog subject={p.title} trigger={<Button className="mt-8" variant="secondary">Send a message</Button>} />
    </div>
  );
}
