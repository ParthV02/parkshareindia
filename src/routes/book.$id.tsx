import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, CreditCard, Info, Loader2, Lock, MapPin, Smartphone, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DemoTag, Stepper } from "@/components/bits";
import { VerificationPanel, isVerified } from "@/components/VerificationPanel";
import { PHOTOS, getListing, type Vehicle } from "@/lib/data";
import { fmtDateTime, inr, priceFor } from "@/lib/format";
import { bookingEnd, hasConflict, makeRef, setState, uid, useStore, type Booking } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/$id")({
  loader: ({ params }) => {
    const l = getListing(params.id);
    if (!l) throw notFound();
    return l;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Book ${loaderData.title} — ParkShare India` : "Booking — ParkShare India" },
      { name: "description", content: "Choose your time, verify, review the price and confirm your parking booking." },
      { property: "og:title", content: "Book parking — ParkShare India" },
      { property: "og:description", content: "Reserve a private parking space in minutes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookPage,
});

const STEPS = ["Details", "Verify", "Review", "Payment", "Confirmed"];

function BookPage() {
  const l = Route.useLoaderData();
  const navigate = useNavigate();
  const { verification } = useStore();
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState(2);
  const [vehicle, setVehicle] = useState<Vehicle>(l.vehicles.includes("Car") ? "Car" : l.vehicles[0]);
  const [fast, setFast] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pay, setPay] = useState<"upi" | "card">("upi");
  const [paying, setPaying] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const price = useMemo(() => priceFor(l.rate, l.dailyCap, hours), [l, hours]);
  const verified = isVerified(verification);

  const startMs = () => (fast ? Date.now() + 5_000 : new Date(`${date}T${time}`).getTime());

  const next0 = () => {
    const e: Record<string, string> = {};
    if (!fast) {
      if (!date) e.date = "Choose a date";
      if (!time) e.time = "Choose a start time";
      if (date && time && new Date(`${date}T${time}`).getTime() < Date.now()) e.time = "Start time must be in the future";
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep(1);
  };

  const confirm = () => {
    setPaying(true);
    setTimeout(() => {
      const start = startMs();
      const draft: Booking = { id: uid(), ref: makeRef(), listingId: l.id, start, hours, rate: l.rate, fee: price.fee, total: price.total, vehicle, cancelled: false, fast, extensions: 0, payment: pay === "upi" ? "UPI (demo)" : "Card (demo)" };
      if (hasConflict(l.id, start, bookingEnd(draft))) {
        setPaying(false);
        toast.error("That time was just booked", { description: "Please choose a different time slot." });
        setStep(0);
        return;
      }
      setState((s) => ({ ...s, bookings: [draft, ...s.bookings] }));
      setBooking(draft);
      setPaying(false);
      setStep(4);
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      {step < 4 && (
        <Link to="/parking/$id" params={{ id: l.id }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary"><ArrowLeft className="size-4" /> Back to listing</Link>
      )}
      <Stepper steps={STEPS} current={step} />

      <div className={cn("mt-8 grid gap-8", step < 4 && "lg:grid-cols-[1fr_320px]")}>
        <div className="card-surface p-6 md:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold">Select booking details</h1>
              <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors", fast ? "border-secondary bg-secondary-soft" : "border-border")}>
                <input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} className="mt-1 size-4 accent-[var(--color-secondary)]" />
                <span>
                  <span className="flex items-center gap-1.5 font-semibold"><Zap className="size-4 text-secondary" /> Start now with accelerated demo timer</span>
                  <span className="block text-sm text-muted-foreground">For presentations: 1 booked hour runs as 1 real minute so you can see the countdown, reminder and extension.</span>
                </span>
              </label>
              {!fast && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-text" htmlFor="b-date">Date</label>
                    <input id="b-date" type="date" className="field" value={date} aria-invalid={!!errors.date} onChange={(e) => setDate(e.target.value)} />
                    {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="label-text" htmlFor="b-time">Start time</label>
                    <input id="b-time" type="time" className="field" value={time} aria-invalid={!!errors.time} onChange={(e) => setTime(e.target.value)} />
                    {errors.time && <p className="mt-1 text-xs text-destructive">{errors.time}</p>}
                  </div>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-text" htmlFor="b-dur">Duration</label>
                  <select id="b-dur" className="field" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map((h) => <option key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text" htmlFor="b-veh">Vehicle type</label>
                  <select id="b-veh" className="field" value={vehicle} onChange={(e) => setVehicle(e.target.value as Vehicle)}>
                    {l.vehicles.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end"><Button size="lg" onClick={next0}>Continue</Button></div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold">Driver verification</h1>
              <VerificationPanel />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button size="lg" disabled={!verified} onClick={() => setStep(2)}>{verified ? "Continue to Review" : "Complete all checks"}</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h1 className="text-xl font-bold">Review price</h1>
              <div>
                <label className="label-text" htmlFor="r-dur">Duration</label>
                <select id="r-dur" className="field max-w-xs" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map((h) => <option key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div className="space-y-2 rounded-xl bg-muted p-5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Hourly rate</span><span>{inr(l.rate)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hours</span><span>× {hours}</span></div>
                {price.base < l.rate * hours && <div className="flex justify-between text-success"><span>Daily cap applied</span><span>−{inr(l.rate * hours - price.base)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Service fee (5%, min ₹10)</span><span>{inr(price.fee)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><span>Total</span><span>{inr(price.total)}</span></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border p-4 text-sm">
                  <p className="font-semibold">Cancellation policy</p>
                  <p className="mt-1 text-muted-foreground">Full refund up to 1 hour before start. 50% refund after that, none once the booking is active.</p>
                </div>
                <div className="rounded-xl border border-border p-4 text-sm">
                  <p className="font-semibold">Parking rules</p>
                  <ul className="mt-1 list-inside list-disc text-muted-foreground">{l.rules.slice(0, 3).map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" onClick={() => setStep(3)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold">Payment</h1>
                <DemoTag>Simulated payment</DemoTag>
              </div>
              <p className="flex items-start gap-2 rounded-xl bg-warning-soft p-3 text-sm text-foreground"><Info className="mt-0.5 size-4 shrink-0 text-warning" /> Payments are simulated. No money will be charged.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {([["upi", Smartphone, "UPI", "Pay with any UPI app"], ["card", CreditCard, "Card", "Debit or credit card"]] as const).map(([k, I, t, d]) => (
                  <button key={k} onClick={() => setPay(k)} className={cn("flex items-center gap-3 rounded-xl border p-4 text-left transition-colors", pay === k ? "border-secondary bg-secondary-soft" : "border-border hover:bg-muted")}>
                    <I className="size-5 text-secondary" /><span><span className="block font-semibold">{t}</span><span className="text-sm text-muted-foreground">{d}</span></span>
                  </button>
                ))}
              </div>
              {pay === "upi" ? (
                <div><label className="label-text" htmlFor="upi">UPI ID</label><input id="upi" className="field" defaultValue="demo@upi" /></div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-3"><label className="label-text" htmlFor="cn">Card number</label><input id="cn" className="field" defaultValue="4111 1111 1111 1111" /></div>
                  <div><label className="label-text" htmlFor="ce">Expiry</label><input id="ce" className="field" defaultValue="12/29" /></div>
                  <div><label className="label-text" htmlFor="cc">CVV</label><input id="cc" className="field" defaultValue="123" /></div>
                </div>
              )}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" onClick={confirm} disabled={paying}>
                  {paying ? <Loader2 className="animate-spin" /> : <Lock />} Confirm Booking · {inr(price.total)}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && booking && (
            <div className="mx-auto max-w-lg py-4 text-center">
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-success-soft ring-8 ring-success-soft/50">
                <CheckCircle2 className="size-10 text-success" />
              </div>
              <h1 className="mt-6 text-2xl font-bold">Booking confirmed</h1>
              <p className="mt-1 text-muted-foreground">Reference <span className="font-mono font-semibold text-foreground">{booking.ref}</span></p>
              <div className="mt-6 space-y-2 rounded-xl border border-border p-5 text-left text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Space</span><span className="font-medium">{l.title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Starts</span><span>{fmtDateTime(booking.start)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ends</span><span>{fmtDateTime(bookingEnd(booking))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-semibold">{inr(booking.total)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium text-success">Confirmed (demo)</span></div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => navigate({ to: "/bookings" })}>View Booking</Button>
                <Button size="lg" className="flex-1" onClick={() => navigate({ to: "/search" })}>Find More Parking</Button>
              </div>
            </div>
          )}
        </div>

        {step < 4 && (
          <aside className="card-surface h-fit overflow-hidden">
            <img src={PHOTOS[l.photo]} alt="" width={1024} height={768} className="aspect-[16/9] w-full object-cover" />
            <div className="space-y-3 p-5 text-sm">
              <p className="font-semibold">{l.title}</p>
              <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="size-3.5" /> {l.locality}, {l.city}</p>
              <div className="space-y-1.5 border-t border-border pt-3">
                <div className="flex justify-between"><span className="text-muted-foreground">When</span><span>{fast ? "Now (demo timer)" : date && time ? `${date} ${time}` : "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{hours} hr{hours > 1 ? "s" : ""}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span>{vehicle}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{inr(price.total)}</span></div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
