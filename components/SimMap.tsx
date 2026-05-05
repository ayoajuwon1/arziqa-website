"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Hub {
  id: string;
  name: string;
  zone: string;
  lat: number;
  lng: number;
  capacity: number;
  status: "offline" | "construction" | "operational";
  utilization: number;
  stored: number;
}

interface Port {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface Route {
  from: { lat: number; lng: number; name?: string };
  to: { lat: number; lng: number; name?: string };
  active: boolean;
}

interface Props {
  hubs: Hub[];
  ports: Port[];
  routes: Route[];
  month: number;
}

export default function SimMap({ hubs, ports, routes, month }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routesRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [8.5, 7.5],
      zoom: 6.2,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    routesRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Resize handler
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers and routes when data changes
  useEffect(() => {
    if (!mapRef.current || !markersRef.current || !routesRef.current) return;

    markersRef.current.clearLayers();
    routesRef.current.clearLayers();

    const statusColors: Record<string, string> = {
      operational: "#22C55E",
      construction: "#F59E0B",
      offline: "#374151",
    };

    // Draw routes
    routes.forEach(r => {
      if (!r.active) return;
      const line = L.polyline(
        [[r.from.lat, r.from.lng], [r.to.lat, r.to.lng]],
        {
          color: "#C9A84C",
          weight: 2,
          opacity: 0.5,
          dashArray: "8 6",
        }
      );
      routesRef.current!.addLayer(line);

      // Animated dot on route
      const dot = L.circleMarker(
        [r.from.lat, r.from.lng],
        { radius: 3, color: "#C9A84C", fillColor: "#C9A84C", fillOpacity: 1, weight: 0 }
      );
      routesRef.current!.addLayer(dot);

      // Animate the dot along the route
      let progress = (Date.now() / 3000) % 1;
      const animate = () => {
        progress = (Date.now() / 3000) % 1;
        const lat = r.from.lat + (r.to.lat - r.from.lat) * progress;
        const lng = r.from.lng + (r.to.lng - r.from.lng) * progress;
        dot.setLatLng([lat, lng]);
      };
      const interval = setInterval(animate, 50);
      // Store cleanup
      (dot as unknown as { _interval: ReturnType<typeof setInterval> })._interval = interval;
    });

    // Draw port markers
    ports.forEach(p => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 8,
        color: "#00D4FF",
        fillColor: "#00D4FF",
        fillOpacity: 0.3,
        weight: 2,
      });
      marker.bindTooltip(`<div style="font-family:monospace;font-size:11px"><strong>${p.name}</strong><br/>Export terminal</div>`, { direction: "top", className: "dark-tooltip" });
      markersRef.current!.addLayer(marker);
    });

    // Draw hub markers
    hubs.forEach(h => {
      const color = statusColors[h.status] || "#374151";
      const radius = h.status === "operational" ? 10 + (h.utilization / 100) * 8 : 8;

      // Outer glow for operational
      if (h.status === "operational") {
        const glow = L.circleMarker([h.lat, h.lng], {
          radius: radius + 8,
          color,
          fillColor: color,
          fillOpacity: 0.1,
          weight: 1,
          opacity: 0.3,
        });
        markersRef.current!.addLayer(glow);
      }

      const marker = L.circleMarker([h.lat, h.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: h.status === "operational" ? 0.7 : 0.3,
        weight: 2,
      });

      marker.bindTooltip(`
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;min-width:180px">
          <div style="font-weight:700;font-size:13px;margin-bottom:4px">${h.name} (${h.zone})</div>
          <div style="color:${color};text-transform:uppercase;font-size:9px;letter-spacing:0.1em;margin-bottom:6px">● ${h.status}</div>
          <table style="width:100%;font-size:10px">
            <tr><td style="color:#6E7681">Capacity</td><td style="text-align:right">${h.capacity.toLocaleString()} MT</td></tr>
            <tr><td style="color:#6E7681">Stored</td><td style="text-align:right">${h.stored.toLocaleString()} MT</td></tr>
            <tr><td style="color:#6E7681">Utilization</td><td style="text-align:right">${h.utilization}%</td></tr>
          </table>
        </div>
      `, { direction: "top", className: "dark-tooltip" });

      markersRef.current!.addLayer(marker);

      // City label
      const label = L.marker([h.lat - 0.3, h.lng], {
        icon: L.divIcon({
          className: "",
          html: `<div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${color};text-align:center;white-space:nowrap;text-shadow:0 0 4px rgba(0,0,0,0.8)">${h.name}</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        }),
      });
      markersRef.current!.addLayer(label);
    });

    // Cleanup animated dots on unmount
    return () => {
      routesRef.current?.eachLayer((layer: L.Layer) => {
        const interval = (layer as unknown as { _interval?: ReturnType<typeof setInterval> })._interval;
        if (interval) clearInterval(interval);
      });
    };
  }, [hubs, ports, routes, month]);

  return (
    <>
      <style>{`
        .dark-tooltip {
          background: rgba(13,17,23,0.95) !important;
          border: 1px solid rgba(48,54,61,0.8) !important;
          color: #C9D1D9 !important;
          border-radius: 6px !important;
          padding: 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
          backdrop-filter: blur(8px) !important;
        }
        .dark-tooltip .leaflet-tooltip-tip {
          border-top-color: rgba(13,17,23,0.95) !important;
        }
        .leaflet-container { background: #0A0E14 !important; }
      `}</style>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
