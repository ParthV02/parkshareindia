import { useSyncExternalStore } from "react";
import type { City, ParkingType, Vehicle } from "./data";

export interface Booking {
  id: string;
  ref: string;
  listingId: string;
  start: number;
  hours: number;
  rate: number;
  fee: number;
  total: number;
  vehicle: Vehicle;
  cancelled: boolean;
  /** Accelerated demo: 1 booked hour = 1 real minute */
  fast: boolean;
  extensions: number;
  payment: string;
}

export type ListingStatus = "Draft" | "Pending Review" | "Approved" | "Rejected" | "Suspended";

export interface OwnerListing {
  id: string;
  title: string;
  city: City;
  locality: string;
  address: string;
  type: ParkingType;
  vehicles: Vehicle[];
  sizeLimit: string;
  rate: number;
  dailyCap: number;
  days: string[];
  from: string;
  to: string;
  blocked: string;
  lat?: number;
  lng?: number;
  photos: string[];
  status: ListingStatus;
  paused: boolean;
  bookings: number;
  earnings: number;
  createdAt: number;
}

export interface Verification {
  mobile: boolean;
  aadhaar: boolean;
  licence: boolean;
  consent: boolean;
}

export interface Report {
  id: string;
  subject: string;
  category: string;
  message: string;
  createdAt: number;
}

export interface State {
  bookings: Booking[];
  listings: OwnerListing[];
  verification: Verification;
  reports: Report[];
  user: { name: string } | null;
}

const KEY = "parkshare-demo-v1";
const HOUR = 3_600_000;

const emptyVerification: Verification = { mobile: false, aadhaar: false, licence: false, consent: false };

const SERVER_STATE: State = {
  bookings: [],
  listings: [],
  verification: emptyVerification,
  reports: [],
  user: null,
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const makeRef = () => "PSI-" + Math.random().toString(36).slice(2, 8).toUpperCase();

function seed(): State {
  const now = Date.now();
  const base = { cancelled: false, fast: false, extensions: 0, payment: "UPI (demo)", fee: 10 };
  return {
    user: null,
    verification: emptyVerification,
    reports: [],
    bookings: [
      { ...base, id: uid(), ref: "PSI-7Q2KD9", listingId: "ps3", start: now + 26 * HOUR, hours: 3, rate: 50, total: 160, vehicle: "Car" },
      { ...base, id: uid(), ref: "PSI-4MZ81A", listingId: "ps1", start: now - 3 * 24 * HOUR, hours: 2, rate: 60, total: 130, vehicle: "Car" },
      { ...base, id: uid(), ref: "PSI-9TX3LE", listingId: "ps9", start: now - 9 * 24 * HOUR, hours: 4, rate: 50, total: 210, vehicle: "Hatchback" },
      { ...base, id: uid(), ref: "PSI-2BC0PW", listingId: "ps4", start: now - 5 * 24 * HOUR, hours: 2, rate: 110, total: 231, fee: 11, vehicle: "SUV", cancelled: true },
    ],
    listings: [
      {
        id: "own1", title: "Lakeview Society Covered Bay", city: "Mumbai", locality: "Powai", address: "Lakeview CHS, Powai", type: "Covered", vehicles: ["Hatchback", "Car"], sizeLimit: "Up to 4.5 m length", rate: 55, dailyCap: 400, days: ["Mon", "Tue", "Wed", "Thu", "Fri"], from: "08:00", to: "20:00", blocked: "", lat: 19.1203, lng: 72.9049, photos: [], status: "Approved", paused: false, bookings: 18, earnings: 4620, createdAt: now - 40 * 24 * HOUR,
      },
      {
        id: "own2", title: "Weekend Driveway near Hiranandani", city: "Mumbai", locality: "Powai", address: "Orchard Avenue, Powai", type: "Open", vehicles: ["Car", "SUV"], sizeLimit: "No restriction", rate: 45, dailyCap: 320, days: ["Sat", "Sun"], from: "07:00", to: "22:00", blocked: "", lat: 19.1166, lng: 72.9103, photos: [], status: "Pending Review", paused: false, bookings: 0, earnings: 0, createdAt: now - 2 * 24 * HOUR,
      },
    ],
  };
}

let state: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? (JSON.parse(raw) as State) : seed();
  } catch {
    state = seed();
  }
  return state;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setState(fn: (s: State) => State) {
  state = fn(load());
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full — keep in memory */
  }
  listeners.forEach((l) => l());
}

export function useStore(): State {
  return useSyncExternalStore(subscribe, load, () => SERVER_STATE);
}

export function resetDemo() {
  state = null;
  localStorage.removeItem(KEY);
  setState(() => seed());
}

// ---- booking helpers
export const bookingEnd = (b: Booking) => b.start + b.hours * (b.fast ? 60_000 : HOUR);
export type BookingStatus = "Upcoming" | "Active" | "Completed" | "Cancelled";
export function bookingStatus(b: Booking, now: number): BookingStatus {
  if (b.cancelled) return "Cancelled";
  if (now < b.start) return "Upcoming";
  if (now < bookingEnd(b)) return "Active";
  return "Completed";
}

/** Simulated server-side conflict check against existing demo bookings. */
export function hasConflict(listingId: string, start: number, end: number, ignoreId?: string) {
  return load().bookings.some(
    (b) =>
      b.id !== ignoreId &&
      b.listingId === listingId &&
      !b.cancelled &&
      start < bookingEnd(b) &&
      end > b.start,
  );
}
