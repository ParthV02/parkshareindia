import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DemoTag } from "@/components/bits";
import { resetDemo, setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — ParkShare India" },
      { name: "description", content: "Continue in demo access mode." },
      { property: "og:title", content: "Sign In — ParkShare India" },
      { property: "og:description", content: "Demo access to ParkShare India." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const { user } = useStore();
  const [name, setName] = useState("");
  const nav = useNavigate();
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card-surface space-y-4 p-6">
        <h1 className="text-2xl font-bold">{user ? `Hi, ${user.name}` : "Sign in"}</h1>
        <DemoTag>Demo access mode</DemoTag>
        {!user ? (
          <>
            <div><label className="label-text" htmlFor="n">Your name</label><input id="n" className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <Button className="w-full" disabled={!name.trim()} onClick={() => { setState((s) => ({ ...s, user: { name: name.trim() } })); toast.success("Signed in (demo)"); nav({ to: "/search" }); }}>Continue in demo mode</Button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Button variant="secondary" onClick={() => nav({ to: "/owner" })}>Switch to Owner mode</Button>
            <Button variant="outline" onClick={() => { setState((s) => ({ ...s, user: null })); }}>Sign out</Button>
            <Button variant="ghost" onClick={() => { resetDemo(); toast.success("Demo data reset"); }}>Reset demo data</Button>
          </div>
        )}
      </div>
    </div>
  );
}
