import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper, DemoTag } from "@/components/bits";
import { LazyMap } from "@/components/LazyMap";
import { CITIES, CITY_NAMES, PARKING_TYPES, VEHICLES, distanceKm, type City, type ParkingType, type Vehicle } from "@/lib/data";
import { setState, uid, type ListingStatus } from "@/lib/store";

export const Route = createFileRoute("/owner/new")({
  head: () => ({
    meta: [
      { title: "Add Parking Space — ParkShare India" },
      { name: "description", content: "List your parking space in five simple steps." },
      { property: "og:title", content: "Add Parking Space — ParkShare India" },
      { property: "og:description", content: "Earn from your unused parking space." },
    ],
  }),
  component: NewListing,
});

const STEPS = ["Basics", "Pricing", "Location", "Photos", "Authorization"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function shrink(file: File): Promise<string> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      const s = 480 / Math.max(img.width, img.height);
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.7));
    };
    img.src = URL.createObjectURL(file);
  });
}

function NewListing() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ title: "", city: "Mumbai" as City, locality: "", address: "", type: "Covered" as ParkingType, vehicles: ["Car"] as Vehicle[], sizeLimit: "", rate: 50, dailyCap: 400, days: ["Mon", "Tue", "Wed", "Thu", "Fri"], from: "08:00", to: "20:00", blocked: "" });
  const [pin, setPin] = useState<[number, number] | null>(null);
  const [acc, setAcc] = useState<number | null>(null);
  const [locCheck, setLocCheck] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [auth, setAuth] = useState({ declare: false, proof: false, society: false });
  const [err, setErr] = useState("");
  const set = (p: Partial<typeof f>) => setF({ ...f, ...p });

  const validate = () => {
    if (step === 0 && (!f.title.trim() || !f.locality.trim() || !f.address.trim())) return "Please fill in title, locality and address.";
    if (step === 1 && (f.rate <= 0 || f.days.length === 0)) return "Set a valid rate and at least one available day.";
    if (step === 2 && !pin) return "Click the map to drop a pin on your space.";
    if (step === 3 && photos.length === 0) return "Add at least one photo.";
    if (step === 4 && !(auth.declare && auth.proof)) return "Please confirm the declaration and proof checklist.";
    return "";
  };
  const next = () => { const e = validate(); setErr(e); if (!e) setStep(step + 1); };
  const save = (status: ListingStatus) => {
    setState((s) => ({ ...s, listings: [{ id: uid(), ...f, lat: pin?.[0], lng: pin?.[1], photos: photos.slice(0, 3), status, paused: false, bookings: 0, earnings: 0, createdAt: Date.now() }, ...s.listings] }));
    toast.success(status === "Draft" ? "Draft saved" : "Submitted for review", { description: "Photos and location don't prove ownership — a reviewer checks your authorization (simulated)." });
    nav({ to: "/owner" });
  };
  const c = CITIES[f.city];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Parking Space</h1>
      <div className="mt-6"><Stepper steps={STEPS} current={step} /></div>
      <div className="card-surface mt-6 space-y-4 p-6">
        {step === 0 && <>
          <div><label className="label-text" htmlFor="t">Listing title</label><input id="t" className="field" value={f.title} onChange={(e) => set({ title: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label-text" htmlFor="c">City</label><select id="c" className="field" value={f.city} onChange={(e) => set({ city: e.target.value as City })}>{CITY_NAMES.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div><label className="label-text" htmlFor="lo">Locality</label><input id="lo" className="field" value={f.locality} onChange={(e) => set({ locality: e.target.value })} /></div>
          </div>
          <div><label className="label-text" htmlFor="a">Address</label><input id="a" className="field" value={f.address} onChange={(e) => set({ address: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label-text" htmlFor="ty">Parking type</label><select id="ty" className="field" value={f.type} onChange={(e) => set({ type: e.target.value as ParkingType })}>{PARKING_TYPES.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div><label className="label-text" htmlFor="sz">Vehicle size restrictions</label><input id="sz" className="field" placeholder="e.g. up to 4.5 m" value={f.sizeLimit} onChange={(e) => set({ sizeLimit: e.target.value })} /></div>
          </div>
          <div><p className="label-text">Vehicle types</p><div className="flex flex-wrap gap-3">{VEHICLES.map((v) => <label key={v} className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={f.vehicles.includes(v)} onChange={() => set({ vehicles: f.vehicles.includes(v) ? f.vehicles.filter((x) => x !== v) : [...f.vehicles, v] })} />{v}</label>)}</div></div>
        </>}
        {step === 1 && <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label-text" htmlFor="r">Price per hour (₹)</label><input id="r" type="number" className="field" value={f.rate} onChange={(e) => set({ rate: Number(e.target.value) })} /></div>
            <div><label className="label-text" htmlFor="d">Daily maximum (₹)</label><input id="d" type="number" className="field" value={f.dailyCap} onChange={(e) => set({ dailyCap: Number(e.target.value) })} /></div>
            <div><label className="label-text" htmlFor="fr">Available from</label><input id="fr" type="time" className="field" value={f.from} onChange={(e) => set({ from: e.target.value })} /></div>
            <div><label className="label-text" htmlFor="to">Available until</label><input id="to" type="time" className="field" value={f.to} onChange={(e) => set({ to: e.target.value })} /></div>
          </div>
          <div><p className="label-text">Available days</p><div className="flex flex-wrap gap-2">{DAYS.map((d) => <button key={d} type="button" onClick={() => set({ days: f.days.includes(d) ? f.days.filter((x) => x !== d) : [...f.days, d] })} className={`rounded-full border px-3 py-1.5 text-sm ${f.days.includes(d) ? "border-secondary bg-secondary-soft text-secondary" : "border-border"}`}>{d}</button>)}</div></div>
          <div><label className="label-text" htmlFor="bl">Blocked dates and times</label><input id="bl" className="field" placeholder="e.g. 25 Dec, Sundays after 6 PM" value={f.blocked} onChange={(e) => set({ blocked: e.target.value })} /></div>
        </>}
        {step === 2 && <>
          <p className="text-sm text-muted-foreground">Click the map to place a pin on your parking space.</p>
          <div className="h-72 overflow-hidden rounded-xl border border-border"><LazyMap className="h-full w-full" center={pin ?? [c.lat, c.lng]} zoom={13} pin={pin} onPick={(a, b) => { setPin([a, b]); setAcc(null); setLocCheck(""); }} /></div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigator.geolocation?.getCurrentPosition((p) => { setPin([p.coords.latitude, p.coords.longitude]); setAcc(p.coords.accuracy); }, () => toast.error("Location permission denied"))}><LocateFixed /> Use my current location</Button>
            <Button variant="secondary" size="sm" disabled={!pin} onClick={() => setLocCheck(pin && distanceKm({ lat: pin[0], lng: pin[1] }, c) < 40 ? `Pin is consistent with ${f.city} and "${f.locality}" (simulated check).` : `Pin is far from ${f.city} — please adjust.`)}>Verify Details</Button>
          </div>
          {pin && <p className="text-sm text-muted-foreground">Pin: {pin[0].toFixed(5)}, {pin[1].toFixed(5)}{acc !== null && ` · GPS accuracy ±${Math.round(acc)} m`}</p>}
          {locCheck && <p className="flex items-center gap-1.5 text-sm text-success"><CheckCircle2 className="size-4" />{locCheck}</p>}
        </>}
        {step === 3 && <>
          <label className="label-text" htmlFor="ph">Parking space and entrance photos</label>
          <input id="ph" type="file" accept="image/*" multiple className="field pt-2" onChange={async (e) => { const out = await Promise.all(Array.from(e.target.files ?? []).map(shrink)); setPhotos([...photos, ...out]); toast.success(`${out.length} photo(s) uploaded (stored locally)`); }} />
          <div className="grid grid-cols-3 gap-3">{photos.map((p, i) => <div key={i} className="relative"><img src={p} alt="" className="aspect-square w-full rounded-xl object-cover" /><span className="absolute bottom-1 left-1 rounded bg-background/90 px-1.5 text-xs text-success">Uploaded</span></div>)}</div>
        </>}
        {step === 4 && <>
          <DemoTag>Simulated review</DemoTag>
          {([["declare", "I declare I am the owner or authorized to offer this space."], ["proof", "I can provide proof (sale deed, rent agreement or allotment letter) if requested."], ["society", "I have society / property-management permission where relevant."]] as const).map(([k, t]) => (
            <label key={k} className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-0.5" checked={auth[k]} onChange={(e) => setAuth({ ...auth, [k]: e.target.checked })} />{t}</label>
          ))}
          <p className="text-sm text-muted-foreground">Photos and location don't prove ownership. Listings move through Draft → Pending Review → Approved / Rejected, and can be Suspended.</p>
        </>}
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={() => (step ? setStep(step - 1) : save("Draft"))}>{step ? "Back" : "Save Draft"}</Button>
          {step < 4 ? <Button onClick={next}>Continue</Button> : <Button onClick={() => { const e = validate(); setErr(e); if (!e) save("Pending Review"); }}>Submit for Review</Button>}
        </div>
      </div>
    </div>
  );
}
