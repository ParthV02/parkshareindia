import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, Car, Clock, DoorOpen, Flag, IndianRupee, MapPin, Ruler, ScrollText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LazyMap } from "@/components/LazyMap";
import { DemoTag, Pill } from "@/components/bits";
import { ReportDialog } from "@/components/ReportDialog";
import { PHOTOS, getListing } from "@/lib/data";
import { inr, priceFor } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/parking/$id")({
  loader: ({ params }) => {
    const l = getListing(params.id);
    if (!l) throw notFound();
    return l;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title}, ${loaderData.locality} — ParkShare India` },
          { name: "description", content: `${loaderData.type} parking in ${loaderData.locality}, ${loaderData.city} from ${inr(loaderData.rate)}/hour.` },
          { property: "og:title", content: `${loaderData.title} — ParkShare India` },
          { property: "og:description", content: `${loaderData.type} parking in ${loaderData.locality}, ${loaderData.city}.` },
        ]
      : [{ title: "Parking space unavailable — ParkShare India" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 text-center">
      <p className="text-xl font-semibold">Listing not found</p>
      <Button asChild className="mt-6"><Link to="/search">Find Parking</Link></Button>
    </div>
  ),
  component: Details,
});

function Details() {
  const l = Route.useLoaderData();
  const [img, setImg] = useState(l.photo);
  const gallery = [l.photo, ...[0, 1, 2, 3].filter((i) => i !== l.photo)];
  const est = priceFor(l.rate, l.dailyCap, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/search" search={{ city: l.city }} className="hover:text-secondary">{l.city}</Link> / <span>{l.locality}</span>
      </nav>
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border">
          <img src={PHOTOS[img]} alt={l.title} width={1024} height={768} className="aspect-[16/10] w-full object-cover" />
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {gallery.slice(1).map((i) => (
            <button key={i} onClick={() => setImg(i)} className={cn("overflow-hidden rounded-xl border-2 transition", img === i ? "border-secondary" : "border-transparent")} aria-label="Show photo">
              <img src={PHOTOS[i]} alt="" loading="lazy" width={1024} height={768} className="aspect-[16/10] h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2"><Pill tone="blue">{l.type}</Pill><DemoTag>Demo listing</DemoTag></div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{l.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-4" /> {l.locality}, {l.city}
              <span className="ml-3 flex items-center gap-1"><Star className="size-4 fill-primary text-primary" /> {l.rating} · {l.reviews} sample reviews</span></p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Car, t: "Vehicles allowed", d: l.vehicles.join(", ") },
              { icon: Ruler, t: "Height / size limit", d: l.maxHeight },
              { icon: Clock, t: "Available times", d: l.hours },
              { icon: IndianRupee, t: "Pricing", d: `${inr(l.rate)}/hr · ${inr(l.dailyCap)} daily cap` },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-3 rounded-xl border border-border p-4">
                <I className="size-5 shrink-0 text-secondary" />
                <div><p className="text-sm font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-semibold"><DoorOpen className="size-5 text-secondary" /> Entry instructions</h2>
            <p className="mt-2 text-muted-foreground">{l.entry}</p>
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-semibold"><ScrollText className="size-5 text-secondary" /> Parking rules</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">{l.rules.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="font-semibold">Hosted by {l.hostName}</p>
            {l.hostVerified ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-success"><BadgeCheck className="size-4" /> Authorization documents reviewed (simulated)</p>
            ) : (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-warning"><AlertTriangle className="size-4" /> Authorization review pending</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">Owners never see your identity documents — only your name and vehicle type.</p>
          </div>

          <div>
            <h2 className="mb-3 font-semibold">Location</h2>
            <div className="h-72 overflow-hidden rounded-2xl border border-border">
              <LazyMap className="h-full w-full" center={[l.lat, l.lng]} zoom={15} points={[{ id: l.id, lat: l.lat, lng: l.lng, label: `₹${l.rate}` }]} selectedId={l.id} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Approximate location. Exact address is shared after booking.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card-surface p-6">
            <p className="text-2xl font-bold">{inr(l.rate)} <span className="text-sm font-normal text-muted-foreground">/ hour</span></p>
            <p className="text-sm text-muted-foreground">Daily cap {inr(l.dailyCap)}</p>
            <div className="my-5 space-y-2 rounded-xl bg-muted p-4 text-sm">
              <p className="font-semibold">Example: 2 hours</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Parking</span><span>{inr(est.base)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Service fee</span><span>{inr(est.fee)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{inr(est.total)}</span></div>
            </div>
            {l.available ? (
              <Button asChild size="lg" className="w-full"><Link to="/book/$id" params={{ id: l.id }}>Book Now</Link></Button>
            ) : (
              <Button size="lg" className="w-full" disabled>Fully booked (demo)</Button>
            )}
            <p className="mt-3 text-center text-xs text-muted-foreground">Free cancellation up to 1 hour before start</p>
            <ReportDialog subject={l.title} trigger={<Button variant="ghost" size="sm" className="mt-3 w-full text-muted-foreground"><Flag /> Report a problem</Button>} />
          </div>
        </aside>
      </div>
    </div>
  );
}
