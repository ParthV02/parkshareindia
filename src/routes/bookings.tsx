import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlarmClock, CalendarDays, CheckCircle2, Clock, Flag, Info, Loader2, MapPin, Plus, Timer, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DemoTag, Pill } from "@/components/bits";
import { ReportDialog } from "@/components/ReportDialog";
import { PHOTOS, getListing } from "@/lib/data";
import { fmtDateTime, fmtDuration, inr, priceFor } from "@/lib/format";
import { bookingEnd, bookingStatus, hasConflict, setState, useStore, type Booking, type BookingStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — ParkShare India" },
      { name: "description", content: "View upcoming, active and past parking bookings, extend time or cancel." },
      { property: "og:title", content: "My Bookings — ParkShare India" },
      { property: "og:description", content: "Manage your parking bookings in one place." },
    ],
  }),
  component: BookingsPage,
});

const TABS: BookingStatus[] = ["Active", "Upcoming", "Completed", "Cancelled"];

function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function BookingsPage() {
  const { bookings } = useStore();
  const now = useNow();
  const [tab, setTab] = useState<BookingStatus>("Active");
  const [extend, setExtend] = useState<Booking | null>(null);
  const [details, setDetails] = useState<Booking | null>(null);
  const reminded = useRef(new Set<string>());

  // In-app expiry reminder (only while this page is open)
  useEffect(() => {
    if (!now) return;
    bookings.forEach((b) => {
      if (bookingStatus(b, now) !== "Active") return;
      const left = bookingEnd(b) - now;
      const threshold = b.fast ? 30_000 : 15 * 60_000;
      const key = `${b.id}-${b.hours}`;
      if (left <= threshold && !reminded.current.has(key)) {
        reminded.current.add(key);
        toast.warning(`Booking ${b.ref} ends in ${fmtDuration(left)}`, {
          description: "Extend now to avoid overstaying.",
          action: { label: "Extend", onClick: () => setExtend(b) },
          duration: 10000,
        });
      }
    });
  }, [now, bookings]);

  if (now === null) return <div className="mx-auto max-w-5xl px-4 py-10"><div className="h-64 animate-pulse rounded-2xl bg-muted" /></div>;

  const grouped = Object.fromEntries(TABS.map((t) => [t, bookings.filter((b) => bookingStatus(b, now) === t)])) as Record<BookingStatus, Booking[]>;
  const list = grouped[tab].sort((a, b) => (tab === "Completed" || tab === "Cancelled" ? b.start - a.start : a.start - b.start));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="mt-1 text-muted-foreground">Bookings are stored on this device as demo records.</p>
        </div>
        <Button asChild><Link to="/search">Find Parking</Link></Button>
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted p-1" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={cn("flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all", tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {t} <span className="ml-1 text-xs text-muted-foreground">{grouped[t].length}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {list.length === 0 && (
          <div className="card-surface flex flex-col items-center p-12 text-center">
            <CalendarDays className="size-10 text-muted-foreground" />
            <p className="mt-3 font-semibold">No {tab.toLowerCase()} bookings</p>
            <p className="mt-1 text-sm text-muted-foreground">{tab === "Active" ? "Book a space with the accelerated demo timer to see a live countdown here." : "Nothing to show yet."}</p>
            <Button asChild className="mt-5"><Link to="/search">Search Parking</Link></Button>
          </div>
        )}
        {list.map((b) => (
          <BookingCard key={b.id} b={b} now={now} onExtend={() => setExtend(b)} onDetails={() => setDetails(b)} />
        ))}
      </div>

      {extend && <ExtendDialog b={extend} onClose={() => setExtend(null)} />}
      <Dialog open={!!details} onOpenChange={(o) => !o && setDetails(null)}>
        <DialogContent>
          {details && (() => {
            const l = getListing(details.listingId);
            return (
              <>
                <DialogHeader><DialogTitle>Booking {details.ref}</DialogTitle><DialogDescription>{l?.title}, {l?.locality}</DialogDescription></DialogHeader>
                <div className="space-y-2 text-sm">
                  {[
                    ["Status", bookingStatus(details, now)],
                    ["Start", fmtDateTime(details.start)],
                    ["End", fmtDateTime(bookingEnd(details))],
                    ["Duration", `${details.hours} hr${details.hours > 1 ? "s" : ""}${details.fast ? " (accelerated demo)" : ""}`],
                    ["Vehicle", details.vehicle],
                    ["Extensions", String(details.extensions)],
                    ["Payment", details.payment],
                    ["Total paid", inr(details.total)],
                  ].map(([k, v]) => <div key={k} className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>)}
                  <p className="pt-2 text-muted-foreground"><span className="font-medium text-foreground">Entry:</span> {l?.entry}</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" asChild><Link to="/info/$page" params={{ page: "support" }}>Contact Support</Link></Button>
                  <Button variant="secondary" asChild><Link to="/parking/$id" params={{ id: details.listingId }}>View Space</Link></Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookingCard({ b, now, onExtend, onDetails }: { b: Booking; now: number; onExtend: () => void; onDetails: () => void }) {
  const l = getListing(b.listingId);
  const status = bookingStatus(b, now);
  const end = bookingEnd(b);
  const left = end - now;
  const total = end - b.start;
  const warn = status === "Active" && left <= (b.fast ? 30_000 : 15 * 60_000);
  const tone = { Active: "success", Upcoming: "blue", Completed: "neutral", Cancelled: "danger" } as const;

  return (
    <article className={cn("card-surface overflow-hidden", warn && "ring-2 ring-warning")}>
      <div className="flex flex-col sm:flex-row">
        <img src={PHOTOS[l?.photo ?? 0]} alt="" loading="lazy" width={1024} height={768} className="aspect-[16/9] w-full object-cover sm:aspect-auto sm:w-48" />
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2"><Pill tone={tone[status]}>{status}</Pill><span className="font-mono text-xs text-muted-foreground">{b.ref}</span>{b.fast && <DemoTag>Accelerated timer</DemoTag>}</div>
              <h3 className="mt-2 font-semibold">{l?.title}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" /> {l?.locality}, {l?.city}</p>
            </div>
            <p className="text-lg font-bold">{inr(b.total)}</p>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="size-4" /> {fmtDateTime(b.start)} → {fmtDateTime(end)} · {b.hours} hr{b.hours > 1 ? "s" : ""}</p>

          {status === "Active" && (
            <div className={cn("mt-4 rounded-xl p-4", warn ? "bg-warning-soft" : "bg-secondary-soft")}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-semibold">{warn ? <AlarmClock className="size-4 text-warning" /> : <Timer className="size-4 text-secondary" />} {warn ? "Ending soon" : "Time remaining"}</span>
                <span className="font-mono text-lg font-bold tabular-nums">{fmtDuration(left)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
                <div className={cn("h-full rounded-full transition-all", warn ? "bg-warning" : "bg-secondary")} style={{ width: `${Math.max(0, (left / total) * 100)}%` }} />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {(status === "Active" || status === "Upcoming") && <Button size="sm" onClick={onExtend}><Plus /> Extend Time</Button>}
            <Button size="sm" variant="secondary" onClick={onDetails}>Booking Details</Button>
            {status === "Upcoming" && (
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="outline"><XCircle /> Cancel Booking</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel booking {b.ref}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {b.start - now > 3_600_000 ? `You'll receive a full refund of ${inr(b.total)} (simulated).` : `Within 1 hour of start: 50% refund of ${inr(Math.round(b.total / 2))} (simulated).`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep booking</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => { setState((s) => ({ ...s, bookings: s.bookings.map((x) => (x.id === b.id ? { ...x, cancelled: true } : x)) })); toast.success("Booking cancelled"); }}>
                      Cancel booking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <ReportDialog subject={`Booking ${b.ref}`} trigger={<Button size="sm" variant="ghost" className="text-muted-foreground"><Flag /> Report a problem</Button>} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ExtendDialog({ b, onClose }: { b: Booking; onClose: () => void }) {
  const l = getListing(b.listingId)!;
  const [add, setAdd] = useState(1);
  const [check, setCheck] = useState<"idle" | "checking" | "ok" | "fail">("idle");
  const current = priceFor(b.rate, l.dailyCap, b.hours);
  const after = priceFor(b.rate, l.dailyCap, b.hours + add);
  const extra = after.total - current.total;

  const runCheck = () => {
    setCheck("checking");
    setTimeout(() => {
      const end = bookingEnd(b);
      const newEnd = b.start + (b.hours + add) * (b.fast ? 60_000 : 3_600_000);
      // Simulated availability: 4+ hour extensions clash with the next demo booking.
      const clash = add >= 4 || hasConflict(b.listingId, end, newEnd, b.id);
      setCheck(clash ? "fail" : "ok");
    }, 900);
  };

  const confirm = () => {
    setState((s) => ({ ...s, bookings: s.bookings.map((x) => (x.id === b.id ? { ...x, hours: x.hours + add, total: x.total + extra, extensions: x.extensions + 1 } : x)) }));
    toast.success("Booking extended", { description: `+${add} hr · ${inr(extra)} charged (simulated). New end time updated.` });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend {b.ref}</DialogTitle>
          <DialogDescription>{l.title} · currently {b.hours} hr{b.hours > 1 ? "s" : ""}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="label-text">1. Choose additional time</p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((h) => (
                <button key={h} onClick={() => { setAdd(h); setCheck("idle"); }}
                  className={cn("rounded-xl border py-3 text-sm font-semibold transition-colors", add === h ? "border-secondary bg-secondary-soft text-secondary" : "border-border hover:bg-muted")}>+{h} hr</button>
              ))}
            </div>
            {b.fast && <p className="mt-1 text-xs text-muted-foreground">Accelerated demo: each hour adds 1 real minute.</p>}
          </div>
          <div>
            <p className="label-text">2. Check availability</p>
            {check === "idle" && <Button variant="secondary" size="sm" onClick={runCheck}>Check availability</Button>}
            {check === "checking" && <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Checking the slot after your booking…</p>}
            {check === "ok" && <p className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="size-4" /> Available (simulated)</p>}
            {check === "fail" && <p className="flex items-center gap-2 text-sm font-medium text-destructive"><XCircle className="size-4" /> Not available — another booking starts soon. Try a shorter extension.</p>}
          </div>
          {check === "ok" && (
            <div className="space-y-1.5 rounded-xl bg-muted p-4 text-sm">
              <p className="label-text">3. Review price</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Additional {add} hr</span><span>{inr(extra)}</span></div>
              <div className="flex justify-between font-semibold"><span>New total</span><span>{inr(b.total + extra)}</span></div>
              <p className="flex items-center gap-1 pt-1 text-xs text-muted-foreground"><Info className="size-3.5" /> Daily cap and fees recalculated.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={check !== "ok"} onClick={confirm}>Confirm Extension</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
