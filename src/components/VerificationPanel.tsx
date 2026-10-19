import { useState } from "react";
import { CheckCircle2, CreditCard, FileBadge, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoTag } from "./bits";
import { setState, useStore, type Verification } from "@/lib/store";

export function VerificationPanel() {
  const { verification: v } = useStore();
  const [busy, setBusy] = useState<keyof Verification | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpErr, setOtpErr] = useState("");

  const mark = (k: keyof Verification) => {
    setBusy(k);
    setTimeout(() => {
      setState((s) => ({ ...s, verification: { ...s.verification, [k]: true } }));
      setBusy(null);
    }, 900);
  };

  const Row = ({ k, icon: I, title, desc, children }: { k: keyof Verification; icon: typeof Smartphone; title: string; desc: string; children?: React.ReactNode }) => (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-start gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${v[k] ? "bg-success-soft text-success" : "bg-secondary-soft text-secondary"}`}>
          {v[k] ? <CheckCircle2 className="size-5" /> : <I className="size-5" />}
        </span>
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
          {v[k] ? <p className="mt-2 text-sm font-medium text-success">Verified (simulated)</p> : <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">One-time check before your first booking.</p>
        <DemoTag>Demo Verification</DemoTag>
      </div>
      <Row k="mobile" icon={Smartphone} title="Mobile verification" desc="We'll send a one-time code to the demo number +91 98XXX XXX10.">
        {!otpSent ? (
          <Button size="sm" variant="secondary" onClick={() => setOtpSent(true)}>Send demo OTP</Button>
        ) : (
          <div className="flex flex-wrap items-start gap-2">
            <div>
              <input className="field h-9 w-36" inputMode="numeric" maxLength={6} placeholder="Enter 123456" value={otp} aria-invalid={!!otpErr} aria-label="OTP"
                onChange={(e) => { setOtp(e.target.value); setOtpErr(""); }} />
              {otpErr && <p className="mt-1 text-xs text-destructive">{otpErr}</p>}
            </div>
            <Button size="sm" variant="secondary" disabled={busy === "mobile"} onClick={() => (otp === "123456" ? mark("mobile") : setOtpErr("Demo code is 123456"))}>
              {busy === "mobile" && <Loader2 className="animate-spin" />} Verify Details
            </Button>
          </div>
        )}
      </Row>
      <Row k="aadhaar" icon={FileBadge} title="Aadhaar identity verification" desc="In production this uses an authorized provider with your consent. No number is collected here.">
        <Button size="sm" variant="secondary" disabled={busy === "aadhaar"} onClick={() => mark("aadhaar")}>
          {busy === "aadhaar" && <Loader2 className="animate-spin" />} Simulate identity check
        </Button>
      </Row>
      <Row k="licence" icon={CreditCard} title="Driving licence verification" desc="Simulated check — please do not enter real licence details.">
        <Button size="sm" variant="secondary" disabled={busy === "licence"} onClick={() => mark("licence")}>
          {busy === "licence" && <Loader2 className="animate-spin" />} Simulate licence check
        </Button>
      </Row>
      <Row k="consent" icon={ShieldCheck} title="Consent & privacy" desc="Your documents are never shown to parking owners. Only your name and vehicle type are shared.">
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 accent-[var(--color-secondary)]" onChange={(e) => e.target.checked && setState((s) => ({ ...s, verification: { ...s.verification, consent: true } }))} />
          I agree to the privacy terms and consent to verification for this demo.
        </label>
      </Row>
    </div>
  );
}

export const isVerified = (v: Verification) => v.mobile && v.aadhaar && v.licence && v.consent;
