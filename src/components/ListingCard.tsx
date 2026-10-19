import { Link } from "@tanstack/react-router";
import { BadgeCheck, Car, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHOTOS, type Listing } from "@/lib/data";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Pill } from "./bits";

export function ListingCard({
  l,
  distance,
  active,
  onFocus,
  compact,
}: {
  l: Listing;
  distance?: number;
  active?: boolean;
  onFocus?: () => void;
  compact?: boolean;
}) {
  return (
    <article
      id={`card-${l.id}`}
      onClick={onFocus}
      className={cn(
        "group card-surface flex flex-col overflow-hidden transition-all hover:shadow-[var(--shadow-lift)]",
        !compact && "sm:flex-row",
        onFocus && "cursor-pointer",
        active && "ring-2 ring-secondary",
      )}
    >
      <div className={cn("relative shrink-0 overflow-hidden bg-muted", compact ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-auto sm:w-56")}>
        <img src={PHOTOS[l.photo]} alt={l.title} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">Demo listing</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{l.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {l.locality}, {l.city}
              {distance !== undefined && <span className="ml-1">· {distance.toFixed(1)} km away</span>}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold leading-none">{inr(l.rate)}</p>
            <p className="text-xs text-muted-foreground">per hour</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Pill tone="blue">{l.type}</Pill>
          <Pill><Car /> {l.vehicles.join(", ")}</Pill>
          {l.available ? <Pill tone="success"><Clock /> Open slots (demo)</Pill> : <Pill tone="danger">Fully booked (demo)</Pill>}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {l.hostVerified ? (
            <span className="flex items-center gap-1 text-success"><BadgeCheck className="size-3.5" /> Host checks done (demo)</span>
          ) : (
            <span className="text-warning">Host review pending</span>
          )}
          <span className="flex items-center gap-1"><Star className="size-3.5 fill-primary text-primary" /> {l.rating} sample rating</span>
        </div>
        <div className="mt-auto flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <Button asChild variant="secondary" size="sm" className="flex-1">
            <Link to="/parking/$id" params={{ id: l.id }}>View Details</Link>
          </Button>
          {l.available ? (
            <Button asChild size="sm" className="flex-1">
              <Link to="/book/$id" params={{ id: l.id }}>Book Now</Link>
            </Button>
          ) : (
            <Button size="sm" className="flex-1" disabled>Book Now</Button>
          )}
        </div>
      </div>
    </article>
  );
}
