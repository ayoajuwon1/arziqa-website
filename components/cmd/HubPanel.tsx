"use client";

import type { HubState } from "../simulation";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", amber: "#F59E0B", red: "#EF4444", cyan: "#00D4FF", gold: "#C9A84C", purple: "#A855F7" };
const mono = "var(--font-mono, monospace)";

const commodityColors: Record<string, string> = {
  "Sesame": "#F59E0B", "Rice": "#22C55E", "Soybeans": "#3B82F6", "Sorghum": "#EF4444",
  "Cocoa": "#92400E", "Cashew": "#D97706", "Maize": "#FBBF24", "Groundnuts": "#B45309",
  "Cassava": "#6EE7B7", "Palm Oil": "#DC2626", "Ginger": "#F97316",
};

function Gauge({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: mono, marginBottom: 3 }}>{label}</div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <div style={{ fontSize: 10, color: C.bright, fontFamily: mono, marginTop: 2 }}>{Math.round(pct)}%</div>
    </div>
  );
}

export default function HubPanel({ hub, hubs, onSelect }: { hub: HubState | null; hubs: HubState[]; onSelect: (id: string) => void }) {
  if (!hub) {
    // Show hub list
    return (
      <div style={{ padding: 8 }}>
        <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: mono, marginBottom: 8 }}>Hubs ({hubs.length})</div>
        {hubs.map(h => (
          <div key={h.id} onClick={() => onSelect(h.id)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, marginBottom: 6, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.bright, fontFamily: mono, fontSize: 13 }}>{h.name}</span>
              <span style={{ fontSize: 9, fontFamily: mono, padding: "2px 6px", borderRadius: 3, background: h.status === "operational" ? "rgba(34,197,94,0.15)" : h.status === "construction" ? "rgba(245,158,11,0.15)" : "rgba(110,118,129,0.15)", color: h.status === "operational" ? C.green : h.status === "construction" ? C.amber : C.dim }}>{h.status}</span>
            </div>
            {h.status === "operational" && (
              <div style={{ marginTop: 6 }}>
                <Gauge label="utilization" pct={h.utilization} color={C.cyan} />
              </div>
            )}
            {h.status === "construction" && (
              <div style={{ marginTop: 6 }}>
                <Gauge label="construction" pct={h.constructionPct} color={C.amber} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Detailed view
  return (
    <div style={{ padding: 8, overflowY: "auto", maxHeight: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, color: C.bright, fontFamily: mono, fontWeight: 600 }}>{hub.name} Hub</div>
          <div style={{ fontSize: 10, color: C.dim, fontFamily: mono }}>{hub.zone} · Phase {hub.phase} · Online M{hub.onlineMonth}</div>
        </div>
        <span style={{ fontSize: 9, fontFamily: mono, padding: "2px 8px", borderRadius: 3, background: hub.status === "operational" ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)", color: hub.status === "operational" ? C.green : C.amber }}>{hub.status.toUpperCase()}</span>
      </div>

      {/* Gauges */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Gauge label="Utilization" pct={hub.utilization} color={C.cyan} />
        <Gauge label="Solar" pct={(hub.power.solarKw / 120) * 100} color={C.gold} />
        <Gauge label="Battery" pct={hub.power.batteryPct} color={C.green} />
        <Gauge label="Water" pct={hub.water.tankPct} color={C.cyan} />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Stored</div>
          <div style={{ fontSize: 14, color: C.bright, fontFamily: mono }}>{hub.stored.toLocaleString()} MT</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Farmers</div>
          <div style={{ fontSize: 14, color: C.bright, fontFamily: mono }}>{hub.farmersToday}</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: 8, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Processing</div>
          <div style={{ fontSize: 14, color: hub.processing.status === "running" ? C.green : hub.processing.status === "maintenance" ? C.amber : C.dim, fontFamily: mono }}>{hub.processing.status}</div>
        </div>
      </div>

      {/* Lab */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Quality Lab</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: mono, color: C.text }}>
          <span>Tests: {hub.lab.testsToday}</span>
          <span>Reject: {hub.lab.rejectionRate}%</span>
          <span style={{ color: hub.lab.aflatoxinPositive > 0 ? C.red : C.dim }}>Aflatoxin: {hub.lab.aflatoxinPositive}</span>
        </div>
      </div>

      {/* Power/Water */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Infrastructure</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: mono, color: C.text }}>
          <span>Grid: <span style={{ color: hub.power.gridUp ? C.green : C.red }}>{hub.power.gridUp ? "UP" : "DOWN"}</span></span>
          <span>Gen Fuel: {hub.power.genFuel}%</span>
          <span>Borehole: <span style={{ color: hub.water.boreholeUp ? C.green : C.red }}>{hub.water.boreholeUp ? "UP" : "DOWN"}</span></span>
        </div>
      </div>

      {/* Bays Grid */}
      <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>Storage Bays</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 10 }}>
        {hub.bays.map(bay => {
          const fill = bay.tonnage / bay.maxTonnage;
          const bgColor = bay.commodity ? (commodityColors[bay.commodity] || C.cyan) : "rgba(255,255,255,0.03)";
          return (
            <div key={bay.id} style={{ background: bay.commodity ? `${bgColor}22` : "rgba(255,255,255,0.03)", border: `1px solid ${bay.commodity ? bgColor : C.border}`, borderRadius: 4, padding: 6, minHeight: 50 }} title={bay.commodity ? `${bay.commodity} (${bay.grade}) — ${bay.tonnage}MT / ${bay.depositor}` : "Empty"}>
              <div style={{ fontSize: 8, color: C.dim, fontFamily: mono }}>B{bay.id}</div>
              {bay.commodity && (
                <>
                  <div style={{ fontSize: 9, color: bgColor, fontFamily: mono, fontWeight: 600, marginTop: 2 }}>{bay.commodity.slice(0, 6)}</div>
                  <div style={{ fontSize: 9, color: C.text, fontFamily: mono }}>{bay.tonnage}MT</div>
                  <div style={{ height: 3, background: "rgba(0,0,0,0.3)", borderRadius: 2, marginTop: 3 }}>
                    <div style={{ width: `${fill * 100}%`, height: "100%", background: bgColor, borderRadius: 2 }} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
