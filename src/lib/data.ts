import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";

export const PHOTOS = [p1, p2, p3, p4];

export type ParkingType = "Covered" | "Open" | "Basement" | "Garage";
export type Vehicle = "Hatchback" | "Car" | "SUV" | "Bike";
export const PARKING_TYPES: ParkingType[] = ["Covered", "Open", "Basement", "Garage"];
export const VEHICLES: Vehicle[] = ["Hatchback", "Car", "SUV", "Bike"];

export const CITIES = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
} as const;
export type City = keyof typeof CITIES;
export const CITY_NAMES = Object.keys(CITIES) as City[];

export const LOCALITIES: { name: string; city: City; lat: number; lng: number }[] = [
  { name: "Andheri West", city: "Mumbai", lat: 19.1364, lng: 72.8296 },
  { name: "Bandra West", city: "Mumbai", lat: 19.0596, lng: 72.8295 },
  { name: "Powai", city: "Mumbai", lat: 19.1176, lng: 72.906 },
  { name: "Lower Parel", city: "Mumbai", lat: 18.9953, lng: 72.8302 },
  { name: "BKC", city: "Mumbai", lat: 19.0662, lng: 72.8654 },
  { name: "Connaught Place", city: "Delhi", lat: 28.6315, lng: 77.2167 },
  { name: "Saket", city: "Delhi", lat: 28.5245, lng: 77.2066 },
  { name: "Koramangala", city: "Bengaluru", lat: 12.9352, lng: 77.6245 },
  { name: "Indiranagar", city: "Bengaluru", lat: 12.9784, lng: 77.6408 },
  { name: "Koregaon Park", city: "Pune", lat: 18.5362, lng: 73.893 },
  { name: "Hinjewadi", city: "Pune", lat: 18.5913, lng: 73.7389 },
  { name: "HITEC City", city: "Hyderabad", lat: 17.4435, lng: 78.3772 },
  { name: "Banjara Hills", city: "Hyderabad", lat: 17.4156, lng: 78.4347 },
  { name: "T. Nagar", city: "Chennai", lat: 13.0418, lng: 80.2341 },
  { name: "Adyar", city: "Chennai", lat: 13.0012, lng: 80.2565 },
];

export interface Listing {
  id: string;
  title: string;
  locality: string;
  city: City;
  lat: number;
  lng: number;
  rate: number;
  dailyCap: number;
  type: ParkingType;
  vehicles: Vehicle[];
  available: boolean;
  hours: string;
  hostName: string;
  hostVerified: boolean;
  rating: number;
  reviews: number;
  photo: number;
  maxHeight: string;
  entry: string;
  rules: string[];
}

const RULES = [
  "Park only within the marked bay",
  "No overnight stay beyond booked time",
  "Keep the entrance clear at all times",
  "No vehicle washing or repairs",
];

function L(
  id: string,
  title: string,
  locality: string,
  city: City,
  lat: number,
  lng: number,
  rate: number,
  type: ParkingType,
  vehicles: Vehicle[],
  extra: Partial<Listing> = {},
): Listing {
  return {
    id,
    title,
    locality,
    city,
    lat,
    lng,
    rate,
    dailyCap: rate * 8,
    type,
    vehicles,
    available: true,
    hours: "7:00 AM – 11:00 PM",
    hostName: "Demo host",
    hostVerified: true,
    rating: 4.6,
    reviews: 24,
    photo: Number(id.replace(/\D/g, "")) % 4,
    maxHeight: type === "Basement" ? "2.1 m" : "No limit",
    entry:
      "Show your booking reference to the security desk at the main gate. Bay number is shared after confirmation.",
    rules: RULES,
    ...extra,
  };
}

export const LISTINGS: Listing[] = [
  L("ps1", "Sunrise Residency Covered Bay", "Andheri West", "Mumbai", 19.1381, 72.8315, 60, "Covered", ["Hatchback", "Car", "SUV"], { hostName: "Meera S.", rating: 4.8, reviews: 61, photo: 0 }),
  L("ps2", "Carter Road Bungalow Driveway", "Bandra West", "Mumbai", 19.0644, 72.8226, 90, "Open", ["Hatchback", "Car"], { hostName: "Rohan D.", rating: 4.7, reviews: 38, photo: 2, hours: "8:00 AM – 10:00 PM" }),
  L("ps3", "Hiranandani Tower Basement B1", "Powai", "Mumbai", 19.1197, 72.9081, 50, "Basement", ["Hatchback", "Car", "SUV", "Bike"], { hostName: "Anil K.", rating: 4.5, reviews: 87, photo: 1, hours: "24 hours" }),
  L("ps4", "Phoenix Lane Private Garage", "Lower Parel", "Mumbai", 18.9968, 72.8263, 110, "Garage", ["Car", "SUV"], { hostName: "Farah Q.", rating: 4.9, reviews: 22, photo: 3 }),
  L("ps5", "BKC Office Annex Parking", "BKC", "Mumbai", 19.0678, 72.8681, 120, "Basement", ["Hatchback", "Car", "SUV"], { hostName: "Vikram P.", hostVerified: false, rating: 4.3, reviews: 12, photo: 1, hours: "9:00 AM – 9:00 PM" }),
  L("ps6", "Lokhandwala Two-Wheeler Spot", "Andheri West", "Mumbai", 19.1409, 72.8268, 20, "Open", ["Bike"], { hostName: "Sana M.", rating: 4.4, reviews: 19, photo: 2, available: false }),
  L("ps7", "Inner Circle Heritage Garage", "Connaught Place", "Delhi", 28.6328, 77.2195, 100, "Garage", ["Car", "SUV"], { hostName: "Arjun B.", rating: 4.7, reviews: 33, photo: 3 }),
  L("ps8", "Select City Walk Neighbour Bay", "Saket", "Delhi", 28.5281, 77.2193, 70, "Covered", ["Hatchback", "Car"], { hostName: "Neha G.", rating: 4.6, reviews: 41, photo: 0 }),
  L("ps9", "5th Block Villa Driveway", "Koramangala", "Bengaluru", 12.9345, 77.6268, 50, "Open", ["Hatchback", "Car", "Bike"], { hostName: "Kiran R.", rating: 4.8, reviews: 56, photo: 2 }),
  L("ps10", "100 Feet Road Covered Slot", "Indiranagar", "Bengaluru", 12.9719, 77.6412, 70, "Covered", ["Hatchback", "Car", "SUV"], { hostName: "Divya N.", rating: 4.5, reviews: 29, photo: 0 }),
  L("ps11", "Lane 6 Garden Parking", "Koregaon Park", "Pune", 18.5389, 73.8949, 40, "Open", ["Hatchback", "Car", "Bike"], { hostName: "Omkar J.", rating: 4.6, reviews: 18, photo: 2 }),
  L("ps12", "Phase 1 IT Park Basement", "Hinjewadi", "Pune", 18.5921, 73.7384, 35, "Basement", ["Hatchback", "Car", "SUV", "Bike"], { hostName: "Pooja T.", rating: 4.4, reviews: 47, photo: 1, hours: "24 hours" }),
  L("ps13", "Cyber Towers Neighbour Garage", "HITEC City", "Hyderabad", 17.4504, 78.3808, 60, "Garage", ["Car", "SUV"], { hostName: "Rahul V.", rating: 4.7, reviews: 26, photo: 3 }),
  L("ps14", "Road No. 12 Covered Bay", "Banjara Hills", "Hyderabad", 17.4126, 78.4382, 55, "Covered", ["Hatchback", "Car"], { hostName: "Ayesha F.", rating: 4.5, reviews: 15, photo: 0 }),
  L("ps15", "Pondy Bazaar Society Basement", "T. Nagar", "Chennai", 13.0422, 80.2337, 45, "Basement", ["Hatchback", "Car", "Bike"], { hostName: "Karthik S.", rating: 4.6, reviews: 34, photo: 1 }),
  L("ps16", "Besant Nagar Bungalow Driveway", "Adyar", "Chennai", 13.0003, 80.2618, 40, "Open", ["Hatchback", "Car", "SUV"], { hostName: "Lakshmi I.", rating: 4.8, reviews: 21, photo: 2 }),
];

export function getListing(id: string) {
  return LISTINGS.find((l) => l.id === id);
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function findLocality(q: string, city?: string) {
  const s = q.trim().toLowerCase();
  if (!s) return undefined;
  return LOCALITIES.find(
    (l) => (!city || l.city === city) && (l.name.toLowerCase().includes(s) || s.includes(l.name.toLowerCase())),
  );
}
