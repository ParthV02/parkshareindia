import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CITY_NAMES, VEHICLES, type City } from "@/lib/data";

export function SearchForm({ defaultCity = "Mumbai" as City }) {
  const navigate = useNavigate();
  const [city, setCity] = useState<City>(defaultCity);
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [hours, setHours] = useState(2);
  const [vehicle, setVehicle] = useState("Car");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/search", search: { city, q, vehicle, hours } });
      }}
      className="card-surface grid gap-3 p-4 sm:grid-cols-2 md:p-5"
    >
      <div>
        <label className="label-text" htmlFor="sf-city">City</label>
        <select id="sf-city" className="field" value={city} onChange={(e) => setCity(e.target.value as City)}>
          {CITY_NAMES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label-text" htmlFor="sf-q">Locality or landmark</label>
        <input id="sf-q" className="field" placeholder="e.g. Andheri West, BKC" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div>
        <label className="label-text" htmlFor="sf-date">Date</label>
        <input id="sf-date" type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-text" htmlFor="sf-time">Start time</label>
          <input id="sf-time" type="time" className="field" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div>
          <label className="label-text" htmlFor="sf-dur">Duration</label>
          <select id="sf-dur" className="field" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
            {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => <option key={h} value={h}>{h} hr{h > 1 ? "s" : ""}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label-text" htmlFor="sf-veh">Vehicle type</label>
        <select id="sf-veh" className="field" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
          {VEHICLES.map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit" size="lg" className="w-full"><Search /> Search Parking</Button>
      </div>
    </form>
  );
}
