"use client";

import type { TruckState } from "../simulation";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", amber: "#F59E0B", red: "#EF4444", cyan: "#00D4FF", purple: "#A855F7" };
const mono = "var(--font-mono, monospace)";

function statusColor(s: TruckState["status"]): string {
  if (s === "en_route") return C.green;
  if (s === "loading" || s === "unloading") return C.amber;
  if (s === "faulty") return C.red;
  if (s === "maintenance") return C.purple;
  return C.dim;
}

export default function FleetPanel({ trucks, selectedTruck, onSelect }: { trucks: TruckState[]; selectedTruck: number | null; onSelect: (id: number) => void }) {
  const selected = selectedTruck ? trucks.find(t => t.id === selectedTruck) : null;

  if (selected) {
    return (
      <div style={{ padding: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 14, color: C.bright, fontFamily: mono, fontWeight: 600 }}>Truck #{selected.id}</div>
          <span style={{ fontSize: 9, fontFamily: mono, padding: "2px 8px", borderRadius: 3, background: `${statusColor(selected.status)}22`, color: statusColor(selected.status) }}>{selected.status.toUpperCase()}</span>
        </div>

        {selected.fault && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: `1px solid ${C.red}`, borderRadius: 6, padding: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: C.red, fontFamily: mono, textTransform: "uppercase", marginBottom: 4 }}>FAULT</div>
            <div style={{ fontSize: 12, color: C.bright, fontFamily: mono }}>{selected.fault}</div>
            {selected.repairEta && <div style={{ fontSize: 10, color: C.dim, fontFamily: mono, marginTop: 4 }}>Repair ETA: {selected.repairEta}</div>}
          </div>
        )}

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, marginBottom: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Driver</div><div style={{ fontSize: 12, color: C.bright, fontFamily: mono }}>{selected.driver}</div></div>
            <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Type</div><div style={{ fontSize: 12, color: C.bright, fontFamily: mono }}>{selected.type}</div></div>
            <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Speed</div><div style={{ fontSize: 12, color: C.bright, fontFamily: mono }}>{selected.speed} km/h</div></div>
            <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Fuel</div><div style={{ fontSize: 12, color: selected.fuelPct < 20 ? C.red : C.bright, fontFamily: mono }}>{selected.fuelPct}%</div></div>
            <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Origin</div><div style={{ fontSize: 12, color: C.text, fontFamily: mono }}>{selected.origin}</div></div>
            <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Destination</div><div style={{ fontSize: 12, color: C.text, fontFamily: mono }}>{selected.destination}</div></div>
          </div>
        </div>

        {selected.cargo && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", marginBottom: 4 }}>Cargo</div>
            <div style={{ fontSize: 13, color: C.bright, fontFamily: mono }}>{selected.cargo.mt} MT {selected.cargo.commodity}</div>
          </div>
        )}

        {selected.status === "en_route" && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", marginBottom: 4 }}>Route Progress</div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${selected.progress * 100}%`, height: "100%", background: C.green, borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 10, color: C.dim, fontFamily: mono, marginTop: 3 }}>{Math.round(selected.progress * 100)}% complete</div>
          </div>
        )}

        <button onClick={() => onSelect(0)} style={{ marginTop: 12, width: "100%", padding: "8px", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 4, color: C.dim, fontFamily: mono, fontSize: 10, cursor: "pointer" }}>← Back to Fleet</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: mono, marginBottom: 8 }}>Fleet ({trucks.length} trucks)</div>
      {trucks.map(truck => (
        <div key={truck.id} onClick={() => onSelect(truck.id)} style={{ background: C.card, border: `1px solid ${selectedTruck === truck.id ? C.cyan : C.border}`, borderRadius: 6, padding: 8, marginBottom: 4, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: C.bright, fontFamily: mono }}>#{truck.id} {truck.driver}</div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>{truck.cargo ? `${truck.cargo.mt}MT ${truck.cargo.commodity}` : "No cargo"}</div>
          </div>
          <span style={{ fontSize: 8, fontFamily: mono, padding: "2px 5px", borderRadius: 3, background: `${statusColor(truck.status)}22`, color: statusColor(truck.status) }}>{truck.status}</span>
        </div>
      ))}
    </div>
  );
}
