import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setState, uid } from "@/lib/store";

export function ReportDialog({ subject, trigger }: { subject: string; trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("Space was occupied");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (message.trim().length < 10) return setErr("Please describe the problem in at least 10 characters.");
    setState((s) => ({ ...s, reports: [{ id: uid(), subject, category, message, createdAt: Date.now() }, ...s.reports] }));
    toast.success("Report submitted", { description: "Saved as a demo record. Our support team would follow up within 24 hours." });
    setOpen(false);
    setMessage("");
    setErr("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report a problem</DialogTitle>
          <DialogDescription>About: {subject}. Reports are stored as demo records in this prototype.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="label-text" htmlFor="rp-cat">What went wrong?</label>
            <select id="rp-cat" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Space was occupied</option>
              <option>Could not access the entrance</option>
              <option>Listing details were inaccurate</option>
              <option>Payment or refund issue</option>
              <option>Safety concern</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="label-text" htmlFor="rp-msg">Details</label>
            <textarea id="rp-msg" aria-invalid={!!err} className="field h-28 py-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what happened…" />
            {err && <p className="mt-1 text-xs text-destructive">{err}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
