import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ParkingSquare, X, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/search", label: "Find Parking" },
  { to: "/owner", label: "Offer Your Space" },
  { to: "/bookings", label: "My Bookings" },
  { to: "/how-it-works", label: "How It Works" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        <ParkingSquare className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-bold tracking-tight">ParkShare <span className="text-secondary">India</span></span>
        <span className="block text-[10px] font-medium text-muted-foreground">Share Space. Park Smart.</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useStore();
  return (
    <header className="sticky top-0 z-[1100] border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "!text-secondary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost">
            <Link to="/signin">
              <UserRound /> {user ? user.name : "Sign In"}
            </Link>
          </Button>
          <Button asChild>
            <Link to="/search">Find Parking</Link>
          </Button>
        </div>
        <Button variant="outline" size="icon" className="lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 lg:hidden">
          <nav className="flex flex-col py-2" aria-label="Mobile">
            {[...NAV, { to: "/signin", label: user ? user.name : "Sign In" } as const].map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-sm font-medium hover:bg-muted">
                {n.label}
              </Link>
            ))}
          </nav>
          <Button asChild className="w-full" onClick={() => setOpen(false)}>
            <Link to="/search">Find Parking</Link>
          </Button>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A peer-to-peer parking prototype for Indian metros. All listings, bookings, payments and verifications shown are simulated demo data.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/info/$page" params={{ page: "about" }} className="hover:text-secondary">About</Link></li>
            <li><Link to="/info/$page" params={{ page: "contact" }} className="hover:text-secondary">Contact</Link></li>
            <li><Link to="/how-it-works" className="hover:text-secondary">Trust & Safety</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Help</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/info/$page" params={{ page: "support" }} className="hover:text-secondary">Support</Link></li>
            <li><Link to="/info/$page" params={{ page: "privacy" }} className="hover:text-secondary">Privacy</Link></li>
            <li><Link to="/info/$page" params={{ page: "terms" }} className="hover:text-secondary">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © 2026 ParkShare India · College project prototype · Map data © OpenStreetMap contributors
      </div>
    </footer>
  );
}
