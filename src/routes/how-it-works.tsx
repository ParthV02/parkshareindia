import { createFileRoute } from "@tanstack/react-router";
import { Camera, FileCheck2, Flag, History, IndianRupee, MapPinned, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/bits";
import { ReportDialog } from "@/components/ReportDialog";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works & Trust — ParkShare India" },
      { name: "description", content: "How booking, verification and owner authorization work on ParkShare India." },
      { property: "og:title", content: "How It Works — ParkShare India" },
      { property: "og:description", content: "Trust and safety on ParkShare India." },
    ],
  }),
  component: Page,
});

const ITEMS = [
  [ShieldCheck, "Driver verification", "Mobile, identity and licence checks via authorized providers (simulated here)."],
  [FileCheck2, "Owner authorization checks", "Owners declare authority and provide proof before approval."],
  [Camera, "Photo evidence", "Space and entrance photos are required on every listing."],
  [MapPinned, "Location consistency", "The map pin is compared with the stated city and locality."],
  [IndianRupee, "Transparent pricing", "Hourly rate, daily cap and fees shown before payment."],
  [History, "Booking history", "Every booking, extension and cancellation is recorded."],
  [Flag, "Dispute reporting", "Report a problem from any booking or listing."],
] as const;

function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <SectionHeading eyebrow="Trust & safety" title="How ParkShare keeps parking fair" desc="Search, verify, book and park — while owners go through authorization review before listings go live." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ITEMS.map(([I, t, d]) => (
          <div key={t} className="card-surface p-5"><I className="size-5 text-secondary" /><p className="mt-3 font-semibold">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></div>
        ))}
      </div>
      <p className="mt-8 rounded-xl bg-warning-soft p-4 text-sm">Verification reduces risk but cannot eliminate every dispute or guarantee legal ownership.</p>
      <ReportDialog subject="General" trigger={<Button className="mt-6" variant="secondary"><Flag /> Report a Problem</Button>} />
    </div>
  );
}
