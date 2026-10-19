import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { MapViewProps } from "./MapView";

const MapView = lazy(() => import("./MapView"));

export function LazyMap(props: MapViewProps) {
  const fallback = <div className={`${props.className ?? ""} animate-pulse bg-muted`} />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <MapView {...props} />
      </Suspense>
    </ClientOnly>
  );
}
