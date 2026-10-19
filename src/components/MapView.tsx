import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

export interface MapViewProps {
  points?: MapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  center: [number, number];
  zoom?: number;
  pin?: [number, number] | null;
  onPick?: (lat: number, lng: number) => void;
  className?: string;
}

export default function MapView({
  points = [],
  selectedId,
  onSelect,
  center,
  zoom = 12,
  pin,
  onPick,
  className,
}: MapViewProps) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const pinRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  const onPickRef = useRef(onPick);
  onSelectRef.current = onSelect;
  onPickRef.current = onPick;

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { zoomControl: true }).setView(center, zoom);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    m.on("click", (e) => onPickRef.current?.(e.latlng.lat, e.latlng.lng));
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    map.current?.setView(center, zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom]);

  useEffect(() => {
    const lg = layer.current;
    if (!lg) return;
    lg.clearLayers();
    points.forEach((p) => {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: "",
          html: `<div class="ps-pin ${p.id === selectedId ? "is-active" : ""}">${p.label}</div>`,
          iconSize: [0, 0],
        }),
        zIndexOffset: p.id === selectedId ? 1000 : 0,
        keyboard: true,
        title: p.label,
      })
        .on("click", () => onSelectRef.current?.(p.id))
        .addTo(lg);
    });
  }, [points, selectedId]);

  useEffect(() => {
    if (!selectedId || !map.current) return;
    const p = points.find((x) => x.id === selectedId);
    if (p) map.current.flyTo([p.lat, p.lng], Math.max(map.current.getZoom(), 14), { duration: 0.6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    pinRef.current?.remove();
    pinRef.current = null;
    if (pin) {
      pinRef.current = L.marker(pin, {
        icon: L.divIcon({ className: "", html: '<div class="ps-dot"></div>', iconSize: [0, 0] }),
      }).addTo(m);
    }
  }, [pin?.[0], pin?.[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={el} className={className} style={{ minHeight: 240 }} />;
}
