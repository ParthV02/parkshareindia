import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { List, Map as MapIcon, SearchX, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/ListingCard";
import { LazyMap } from "@/components/LazyMap";
import { DemoTag } from "@/components/bits";
import {
  CITIES, CITY_NAMES, LISTINGS, PARKING_TYPES, VEHICLES, distanceKm, findLocality,
  type City, type ParkingType, type Vehicle,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type S = { city?: City; q?: string; vehicle?: string; hours?: number };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): S => ({
    city: CITY_NAMES.includes(s.city as City) ? (s.city as City) : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    vehicle: typeof s.vehicle === "string" ? s.vehicle : undefined,
    hours: typeof s.hours === "number" ? s.hours : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find Parking — ParkShare India" },
      { name: "description", content: "Search and filter private parking spaces on an interactive map across Indian metros." },
      { property: "og:title", content: "Find Parking — ParkShare India" },
      { property: "og:description", content: "Compare parking prices, types and vehicle limits on a live map." },
    ],
  }),
  component: SearchPage,
});

function toggle<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function SearchPage() {
  const sp = Route.useSearch();
  const [city, setCity] = useState<City>(sp.city ?? "Mumbai");
  const [q, setQ] = useState(sp.q ?? "");
  const [maxPrice, setMaxPrice] = useState(150);
  const [types, setTypes] = useState<ParkingType[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES.includes(sp.vehicle as Vehicle) ? [sp.vehicle as Vehicle] : []);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [maxDist, setMaxDist] = useState(10);
  const [sort, setSort] = useState<"relevance" | "price" | "distance">("relevance");
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);

  const loc = findLocality(q, city);
  const results = useMemo(() => {
    let r = LISTINGS.filter((l) => l.city === city)
      .map((l) => ({ l, d: loc ? distanceKm(loc, l) : undefined }))
      .filter(({ l, d }) =>
        l.rate <= maxPrice &&
        (types.length === 0 || types.includes(l.type)) &&
        (vehicles.length === 0 || vehicles.some((v) => l.vehicles.includes(v))) &&
        (!onlyAvail || l.available) &&
        (d === undefined || d <= maxDist) &&
        (loc || !q.trim() || `${l.title} ${l.locality}`.toLowerCase().includes(q.trim().toLowerCase())),
      );
    if (sort === "price") r = [...r].sort((a, b) => a.l.rate - b.l.rate);
    if (sort === "distance" && loc) r = [...r].sort((a, b) => (a.d ?? 0) - (b.d ?? 0));
    if (sort === "relevance") r = [...r].sort((a, b) => Number(b.l.available) - Number(a.l.available) || b.l.rating - a.l.rating);
    return r;
  }, [city, q, loc, maxPrice, types, vehicles, onlyAvail, maxDist, sort]);

  const points = useMemo(() => results.map(({ l }) => ({ id: l.id, lat: l.lat, lng: l.lng, label: `₹${l.rate}` })), [results]);
  const center: [number, number] = loc ? [loc.lat, loc.lng] : [CITIES[city].lat, CITIES[city].lng];

  const selectFromMap = (id: string) => {
    setSelected(id);
    setView("list");
    setTimeout(() => document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const reset = () => { setMaxPrice(150); setTypes([]); setVehicles([]); setOnlyAvail(false); setMaxDist(10); setQ(""); };

  const filters = (
    <div className="space-y-5">
      <div>
        <p className="label-text">Price per hour: up to ₹{maxPrice}</p>
        <input type="range" min={20} max={150} step={10} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--color-secondary)]" aria-label="Maximum price" />
      </div>
      <fieldset>
        <legend className="label-text">Parking type</legend>
        <div className="flex flex-wrap gap-2">
          {PARKING_TYPES.map((t) => (
            <button key={t} type="button" onClick={() => setTypes(toggle(types, t))} aria-pressed={types.includes(t)}
              className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", types.includes(t) ? "border-secondary bg-secondary-soft text-secondary" : "border-border hover:bg-muted")}>{t}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label-text">Vehicle</legend>
        <div className="flex flex-wrap gap-2">
          {VEHICLES.map((v) => (
            <button key={v} type="button" onClick={() => setVehicles(toggle(vehicles, v))} aria-pressed={vehicles.includes(v)}
              className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", vehicles.includes(v) ? "border-secondary bg-secondary-soft text-secondary" : "border-border hover:bg-muted")}>{v}</button>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} className="size-4 accent-[var(--color-secondary)]" /> Only show spaces with open slots
      </label>
      <div className={cn(!loc && "opacity-50")}>
        <p className="label-text">Distance from {loc ? loc.name : "destination"}: within {maxDist} km</p>
        <input type="range" min={1} max={10} value={maxDist} disabled={!loc} onChange={(e) => setMaxDist(Number(e.target.value))} className="w-full accent-[var(--color-secondary)]" aria-label="Maximum distance" />
        {!loc && <p className="text-xs text-muted-foreground">Enter a known locality to enable distance.</p>}
      </div>
      <Button variant="outline" size="sm" onClick={reset}>Reset filters</Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6">
      <div className="card-surface grid gap-3 p-3 md:grid-cols-[180px_1fr_180px_auto]">
        <select className="field" value={city} onChange={(e) => { setCity(e.target.value as City); setSelected(null); }} aria-label="City">
          {CITY_NAMES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Locality or landmark (e.g. Bandra West)" aria-label="Locality" list="localities" />
        <datalist id="localities">{["Andheri West", "Bandra West", "Powai", "Lower Parel", "BKC", "Connaught Place", "Saket", "Koramangala", "Indiranagar", "Koregaon Park", "Hinjewadi", "HITEC City", "Banjara Hills", "T. Nagar", "Adyar"].map((x) => <option key={x} value={x} />)}</datalist>
        <select className="field" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort by">
          <option value="relevance">Sort: Relevance</option>
          <option value="price">Sort: Price (low → high)</option>
          <option value="distance" disabled={!loc}>Sort: Distance</option>
        </select>
        <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}><SlidersHorizontal /> Filters</Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
        <aside className={cn("card-surface h-fit p-5 lg:sticky lg:top-24 lg:block", !showFilters && "hidden")}>
          <p className="mb-4 font-semibold">Filters</p>
          {filters}
        </aside>

        <section className={cn(view === "map" && "hidden lg:block")}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{results.length}</span> spaces in {loc ? loc.name + ", " : ""}{city}</p>
            <DemoTag>Demo listings</DemoTag>
          </div>
          {results.length === 0 ? (
            <div className="card-surface flex flex-col items-center p-10 text-center">
              <SearchX className="size-10 text-muted-foreground" />
              <p className="mt-3 font-semibold">No spaces match these filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try widening the price or distance range.</p>
              <Button className="mt-4" variant="secondary" onClick={reset}>Reset filters</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(({ l, d }) => (
                <ListingCard key={l.id} l={l} distance={d} active={selected === l.id} onFocus={() => setSelected(l.id)} />
              ))}
            </div>
          )}
        </section>

        <section className={cn("lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]", view === "list" && "hidden lg:block")}>
          <div className="relative h-[70vh] overflow-hidden rounded-2xl border border-border lg:h-full">
            <LazyMap className="h-full w-full" center={center} zoom={loc ? 14 : 12} points={points} selectedId={selected} onSelect={selectFromMap} />
            <span className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-md bg-background/95 px-2 py-1 text-[11px] text-muted-foreground shadow">Demo pins on a real OpenStreetMap base</span>
          </div>
        </section>
      </div>

      <div className="fixed bottom-5 left-1/2 z-[1000] -translate-x-1/2 lg:hidden">
        <Button variant="secondary" className="rounded-full shadow-lg" onClick={() => setView((v) => (v === "list" ? "map" : "list"))}>
          {view === "list" ? <><MapIcon /> Map</> : <><List /> List</>}
        </Button>
      </div>
    </div>
  );
}
