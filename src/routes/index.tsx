import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck, CalendarClock, Camera, CircleDollarSign, FileCheck2, History, IndianRupee, MapPin,
  MapPinned, Search, ShieldCheck, Smartphone, Timer, Wallet, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/SearchForm";
import { ListingCard } from "@/components/ListingCard";
import { SectionHeading } from "@/components/bits";
import { CITY_NAMES, LISTINGS, PHOTOS } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ParkShare India — Find & Share Parking in Indian Cities" },
      { name: "description", content: "Discover private parking near your destination in Mumbai, Delhi, Bengaluru and more. Book in minutes or earn from your unused space." },
      { property: "og:title", content: "ParkShare India — Share Space. Park Smart." },
      { property: "og:description", content: "Peer-to-peer parking for Indian metros. Book a slot in minutes or list your unused space." },
    ],
  }),
  component: Index,
});

const TRUST = [
  { icon: CalendarClock, t: "Easy Booking", d: "Reserve in under a minute" },
  { icon: IndianRupee, t: "Transparent Pricing", d: "Hourly rates, daily caps" },
  { icon: BadgeCheck, t: "Verified Listings", d: "Owner checks before going live" },
  { icon: Timer, t: "Flexible Extensions", d: "Add time from your phone" },
];

const STEPS = [
  { icon: Search, t: "Search your destination", d: "Enter a city, locality or landmark and when you need to park." },
  { icon: MapPinned, t: "Compare nearby spaces", d: "See prices, parking type and vehicle limits on a map." },
  { icon: Smartphone, t: "Verify & book", d: "Quick one-time verification, then confirm and pay securely." },
  { icon: Timer, t: "Park & extend", d: "Get entry instructions and extend time if plans change." },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Smarter parking for smarter cities</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            Your parking spot is closer than you think.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Discover convenient parking spaces near your destination. Book your slot in minutes and spend less time searching.
          </p>
          <div className="mt-7"><SearchForm /></div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {CITY_NAMES.map((c) => (
              <Link key={c} to="/search" search={{ city: c }} className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium transition-colors hover:border-secondary hover:text-secondary">
                {c}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-lift)]">
            <img src={PHOTOS[0]} alt="Covered residential parking bay in Mumbai" width={1024} height={768} className="aspect-[4/5] w-full object-cover md:aspect-[5/5]" />
          </div>
          <div className="absolute left-[18%] top-[22%] flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-bold shadow-lg ring-2 ring-secondary"><MapPin className="size-3.5 text-secondary" /> ₹60/hr</div>
          <div className="absolute right-[14%] top-[42%] flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold shadow-lg ring-2 ring-foreground"><MapPin className="size-3.5" /> ₹50/hr</div>
          <div className="card-surface absolute -bottom-6 left-4 flex w-64 items-center gap-3 p-3 md:-left-8">
            <img src={PHOTOS[1]} alt="" width={1024} height={768} className="size-14 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Hiranandani Basement B1</p>
              <p className="text-xs text-muted-foreground">Powai · 24 hours</p>
              <p className="mt-0.5 text-sm font-bold">₹50 <span className="text-xs font-normal text-muted-foreground">/ hour</span></p>
            </div>
          </div>
          <div className="card-surface absolute -top-4 right-4 hidden items-center gap-2 p-3 sm:flex md:-right-4">
            <span className="flex size-8 items-center justify-center rounded-full bg-success-soft text-success"><BadgeCheck className="size-4" /></span>
            <div><p className="text-xs font-semibold">Booking confirmed</p><p className="text-[11px] text-muted-foreground">Andheri West · 2 hrs</p></div>
          </div>
          <p className="mt-10 text-center text-xs text-muted-foreground">Illustrative preview with demo listings</p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-muted">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-6">
          {TRUST.map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-secondary shadow-sm ring-1 ring-border"><I className="size-5" /></span>
              <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <SectionHeading eyebrow="How ParkShare works" title="From search to parked in four simple steps" center />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: I, t, d }, i) => (
            <div key={t} className="card-surface relative p-6">
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-border">{i + 1}</span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary-soft text-secondary"><I className="size-5" /></span>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Find parking near you" title="Popular spaces in Mumbai" desc="Sample listings for demonstration — availability and ratings are not live." />
            <Button asChild variant="secondary"><Link to="/search" search={{ city: "Mumbai" }}>View all on map</Link></Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LISTINGS.slice(0, 4).map((l) => <ListingCard key={l.id} l={l} compact />)}
          </div>
        </div>
      </section>

      {/* Owners */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border">
          <img src={PHOTOS[3]} alt="Private garage available for sharing" loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
        </div>
        <div>
          <SectionHeading eyebrow="For property owners" title="Turn your empty parking spot into monthly income" desc="Whether it's a society bay you don't use on weekdays or a driveway that sits empty, list it in minutes and stay in control." />
          <ul className="mt-6 space-y-4">
            {[
              { icon: Wallet, t: "Set your own rates", d: "Choose hourly prices, daily caps and the hours you're available." },
              { icon: CalendarClock, t: "Block dates anytime", d: "Pause listings or block specific dates in one tap." },
              { icon: CircleDollarSign, t: "Track earnings", d: "See bookings and estimated earnings from your dashboard." },
            ].map(({ icon: I, t, d }) => (
              <li key={t} className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft"><I className="size-5" /></span>
                <div><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/owner/new">Add Parking Space</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/owner">Owner Dashboard</Link></Button>
          </div>
        </div>
      </section>

      {/* Trust & safety */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="rounded-3xl border border-border bg-muted p-8 md:p-12">
          <SectionHeading eyebrow="Trust & safety" title="Checks on both sides of every booking" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, t: "Driver verification", d: "Mobile, ID and licence checks before booking." },
              { icon: FileCheck2, t: "Owner authorization", d: "Proof of permission reviewed before approval." },
              { icon: Camera, t: "Photo evidence", d: "Space and entrance photos on every listing." },
              { icon: History, t: "Booking history", d: "Every booking and extension is logged." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl bg-background p-5 ring-1 ring-border">
                <I className="size-5 text-secondary" />
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /> Verification reduces risk but cannot eliminate every dispute or guarantee legal ownership.
            <Link to="/how-it-works" className="font-medium text-secondary hover:underline">Learn more</Link>
          </p>
        </div>
      </section>
    </>
  );
}
