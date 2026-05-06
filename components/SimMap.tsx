"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { HubState, TruckState, PortState } from "./simulation";

interface Props {
  hubs: HubState[];
  trucks: TruckState[];
  ports: PortState[];
  selectedHub: string | null;
  selectedTruck: number | null;
  onHubClick: (hubId: string) => void;
  onTruckClick: (truckId: number) => void;
}

const COLORS = {
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  gray: "#6E7681",
  cyan: "#00D4FF",
  gold: "#C9A84C",
  purple: "#A855F7",
  bg: "#0A0E14",
};

function hubColor(status: HubState["status"]): string {
  if (status === "operational") return COLORS.green;
  if (status === "construction") return COLORS.amber;
  return COLORS.gray;
}

function truckColor(status: TruckState["status"]): string {
  if (status === "en_route") return COLORS.green;
  if (status === "loading" || status === "unloading") return COLORS.amber;
  if (status === "faulty") return COLORS.red;
  if (status === "maintenance") return COLORS.purple;
  return COLORS.gray;
}

export default function SimMap({ hubs, trucks, ports, selectedHub, selectedTruck, onHubClick, onTruckClick }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hubMarkersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const truckMarkersRef = useRef<Map<number, L.CircleMarker>>(new Map());
  const portMarkersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const onHubClickRef = useRef(onHubClick);
  const onTruckClickRef = useRef(onTruckClick);

  onHubClickRef.current = onHubClick;
  onTruckClickRef.current = onTruckClick;

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [8.5, 7.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    routesLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update markers
  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old routes
    routesLayerRef.current?.clearLayers();

    // --- Hub markers ---
    const existingHubIds = new Set(hubMarkersRef.current.keys());
    for (const hub of hubs) {
      existingHubIds.delete(hub.id);
      let marker = hubMarkersRef.current.get(hub.id);
      const radius = hub.status === "operational" ? 10 + (hub.utilization / 20) : 7;
      const color = selectedHub === hub.id ? COLORS.cyan : hubColor(hub.status);

      if (!marker) {
        marker = L.circleMarker([hub.lat, hub.lng], {
          radius,
          fillColor: color,
          fillOpacity: 0.8,
          color: color,
          weight: selectedHub === hub.id ? 3 : 1,
        }).addTo(map);
        marker.on("click", () => onHubClickRef.current(hub.id));
        marker.bindTooltip(`${hub.name} (${hub.status})`, { direction: "top", className: "dark-tooltip" });
        hubMarkersRef.current.set(hub.id, marker);
      } else {
        marker.setLatLng([hub.lat, hub.lng]);
        marker.setRadius(radius);
        marker.setStyle({ fillColor: color, color: color, weight: selectedHub === hub.id ? 3 : 1 });
        marker.setTooltipContent(`${hub.name} — ${hub.status === "operational" ? `${Math.round(hub.utilization)}% util` : hub.status}`);
      }
    }
    existingHubIds.forEach(id => { hubMarkersRef.current.get(id)?.remove(); hubMarkersRef.current.delete(id); });

    // --- Truck markers ---
    const existingTruckIds = new Set(truckMarkersRef.current.keys());
    for (const truck of trucks) {
      if (truck.status === "idle") {
        const existing = truckMarkersRef.current.get(truck.id);
        if (existing) { existing.remove(); truckMarkersRef.current.delete(truck.id); }
        existingTruckIds.delete(truck.id);
        continue;
      }
      existingTruckIds.delete(truck.id);
      let marker = truckMarkersRef.current.get(truck.id);
      const color = selectedTruck === truck.id ? COLORS.cyan : truckColor(truck.status);

      if (!marker) {
        marker = L.circleMarker([truck.lat, truck.lng], {
          radius: 5,
          fillColor: color,
          fillOpacity: 0.9,
          color: color,
          weight: selectedTruck === truck.id ? 3 : 1,
        }).addTo(map);
        marker.on("click", () => onTruckClickRef.current(truck.id));
        marker.bindTooltip(`Truck #${truck.id} — ${truck.driver}`, { direction: "top", className: "dark-tooltip" });
        truckMarkersRef.current.set(truck.id, marker);
      } else {
        marker.setLatLng([truck.lat, truck.lng]);
        marker.setStyle({ fillColor: color, color: color, weight: selectedTruck === truck.id ? 3 : 1 });
        marker.setTooltipContent(`Truck #${truck.id} — ${truck.status}${truck.cargo ? ` (${truck.cargo.mt}MT ${truck.cargo.commodity})` : ""}`);
      }
    }
    existingTruckIds.forEach(id => { truckMarkersRef.current.get(id)?.remove(); truckMarkersRef.current.delete(id); });

    // --- Port markers ---
    const existingPortIds = new Set(portMarkersRef.current.keys());
    for (const port of ports) {
      existingPortIds.delete(port.id);
      let marker = portMarkersRef.current.get(port.id);
      if (!marker) {
        marker = L.circleMarker([port.lat, port.lng], {
          radius: 8,
          fillColor: COLORS.gold,
          fillOpacity: 0.8,
          color: COLORS.gold,
          weight: 2,
        }).addTo(map);
        marker.bindTooltip(`${port.name} — ${port.containersWaiting} containers waiting`, { direction: "top", className: "dark-tooltip" });
        portMarkersRef.current.set(port.id, marker);
      } else {
        marker.setLatLng([port.lat, port.lng]);
        marker.setTooltipContent(`${port.name} — ${port.containersWaiting} containers waiting`);
      }
    }
    existingPortIds.forEach(id => { portMarkersRef.current.get(id)?.remove(); portMarkersRef.current.delete(id); });

    // --- Route polylines ---
    for (const truck of trucks) {
      if (truck.status === "en_route" && truck.cargo) {
        const originHub = hubs.find(h => h.id === truck.origin);
        const destPort = ports.find(p => p.id === truck.destination);
        const destHub = hubs.find(h => h.id === truck.destination);
        const from = originHub ? [originHub.lat, originHub.lng] as [number, number] : null;
        const to = destPort ? [destPort.lat, destPort.lng] as [number, number] : destHub ? [destHub.lat, destHub.lng] as [number, number] : null;
        if (from && to) {
          L.polyline([from, to], { color: COLORS.gold, weight: 1.5, opacity: 0.4, dashArray: "6 4" }).addTo(routesLayerRef.current!);
        }
      }
    }
  }, [hubs, trucks, ports, selectedHub, selectedTruck]);

  useEffect(() => { updateMarkers(); }, [updateMarkers]);

  // Pan to selected hub
  useEffect(() => {
    if (selectedHub && mapRef.current) {
      const hub = hubs.find(h => h.id === selectedHub);
      if (hub) mapRef.current.flyTo([hub.lat, hub.lng], 9, { duration: 0.8 });
    }
  }, [selectedHub, hubs]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: COLORS.bg }} />
  );
}
