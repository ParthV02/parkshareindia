import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Building2, CalendarCheck, Clock, IndianRupee, ParkingSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTag, Pill } from "@/components/bits";
import { inr } from "@/lib/format";
import { setState, useStore, type ListingStatus, type OwnerListing } from "@/lib/store";

export const Route = createFileRoute("/owner/")({
  head: () => ({
    meta: [
      { title: "Owner Dashboard — ParkShare India" },
      { name: "description", content: "Manage your parking listings, bookings and estimated earnings." },
      { property: "og:title", content: "Owner Dashboard — ParkShare India" },
      { property: "og:description", content: "List your unused parking and track earnings." },
    ],
  }),
  component: Owner,
});

const tone: Record<ListingStatus, "neutral" | "warning" | "success" | "danger"> = {
  Draft: "neutral", "Pending Review": "warning", Approved: "success", Rejected: "danger", Suspended: "danger",
};

function update(id: string, patch: Partial<OwnerListing>) {
  setState((s) => ({ ...s, listings: s.listings.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
}

function Owner() {
  const { listings } = useStore();
  const stats = [
    { icon: Building2, t: "Total listings", v: listings.length },
    { icon: ParkingSquare, t: "Active listings", v: listings.filter((l) => l.status === "Approved" && !l.paused).length },
    { icon: Clock, t: "Pending reviews", v: listings.filter((l) => l.status === "Pending Review").length },
    { icon: CalendarCheck, t: "Total bookings", v: listings.reduce((a, l) => a + l.bookings, 0) },
    { icon: IndianRupee, t: "Est. earnings", v: inr(listings.reduce((a, l) => a + l.earnings, 0)) },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offer Your Space</h1>
          <p className="mt-1 text-muted-foreground">Owner dashboard <DemoTag /></p>
        </div>
        <Button asChild size="lg"><Link to="/owner/new">Add Parking Space</Link></Button>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map(({ icon: I, t, v }) => (
          <div key={t} className="card-surface p-5">
            <I className="size-5 text-secondary" />
            <p className="mt-3 text-2xl font-bold">{v}</p>
            <p className="text-sm text-muted-foreground">{t}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-xl font-semibold">Your listings</h2>
      <div className="mt-4 space-y-4">
        {listings.map((l) => (
          <div key={l.id} className="card-surface flex flex-col gap-4 p-5 md:flex-row md:items-center">
            {l.photos[0] ? <img src={l.photos[0]} alt="" className="size-20 rounded-xl object-cover" /> : <div className="flex size-20 items-center justify-center rounded-xl bg-muted"><ParkingSquare className="text-muted-foreground" /></div>}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2"><Pill tone={tone[l.status]}>{l.status}</Pill>{l.paused && <Pill>Paused</Pill>}</div>
              <p className="mt-1 font-semibold">{l.title}</p>
              <p className="text-sm text-muted-foreground">{l.locality}, {l.city} · {inr(l.rate)}/hr · {l.from}–{l.to} · {l.bookings} bookings · {inr(l.earnings)} earned</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => {
                const r = prompt("New hourly rate (₹)", String(l.rate));
                if (r && Number(r) > 0) { update(l.id, { rate: Number(r) }); toast.success("Rate updated"); }
              }}>Adjust Rate</Button>
              <Button size="sm" variant="outline" onClick={() => {
                if (confirm(l.paused ? "Resume this listing?" : "Pause this listing? Drivers won't be able to book it.")) { update(l.id, { paused: !l.paused }); toast.success(l.paused ? "Listing resumed" : "Listing paused"); }
              }}>{l.paused ? "Resume" : "Pause"}</Button>
              {l.status === "Pending Review" && (
                <Button size="sm" variant="outline" onClick={() => { update(l.id, { status: "Approved" }); toast.success("Simulated review: approved"); }}>Simulate approval</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
