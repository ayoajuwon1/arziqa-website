"use client";

import type { SimulationState } from "../simulation";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", amber: "#F59E0B", cyan: "#00D4FF" };
const mono = "var(--font-mono, monospace)";

export default function PeoplePanel({ state }: { state: SimulationState }) {
  const { headcount, hubs } = state;
  const salaryPerHead = 3500; // avg monthly USD
  const totalSalary = headcount.hired * salaryPerHead;
  const fillPct = headcount.planned > 0 ? (headcount.hired / headcount.planned) * 100 : 0;

  // Per-hub breakdown
  const operationalHubs = hubs.filter(h => h.status === "operational");
  const hubStaff = operationalHubs.map(h => {
    const planned = 25;
    const hired = Math.min(planned, Math.round(planned * (h.utilization / 100) * 1.2));
    return { name: h.name, hired, planned };
  });

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: mono, marginBottom: 8 }}>Headcount</div>

      {/* Summary */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Hired / Planned</div>
            <div style={{ fontSize: 20, color: C.bright, fontFamily: mono }}>{headcount.hired} <span style={{ color: C.dim, fontSize: 14 }}>/ {headcount.planned}</span></div>
          </div>
          <div style={{ fontSize: 12, color: fillPct > 80 ? C.green : C.amber, fontFamily: mono }}>{Math.round(fillPct)}%</div>
        </div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${fillPct}%`, height: "100%", background: fillPct > 80 ? C.green : C.amber, borderRadius: 4 }} />
        </div>
      </div>

      {/* Salary */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>Monthly Salary Cost</div>
        <div style={{ fontSize: 18, color: C.bright, fontFamily: mono, marginTop: 4 }}>${totalSalary.toLocaleString()}</div>
        <div style={{ fontSize: 10, color: C.dim, fontFamily: mono }}>Avg ${salaryPerHead}/head</div>
      </div>

      {/* By Hub */}
      <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>By Hub</div>
      {hubStaff.map(h => (
        <div key={h.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, padding: 8, marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: mono }}>
            <span style={{ color: C.text }}>{h.name}</span>
            <span style={{ color: C.bright }}>{h.hired}/{h.planned}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
            <div style={{ width: `${(h.hired / h.planned) * 100}%`, height: "100%", background: C.cyan, borderRadius: 2 }} />
          </div>
        </div>
      ))}

      {/* Central team */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, marginTop: 10 }}>
        <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", marginBottom: 6 }}>Central Team</div>
        {["CEO / Strategy", "CFO / Finance", "COO / Operations", "CTO / Technology", "Head of Exports", "Head of WR"].map(role => (
          <div key={role} style={{ fontSize: 10, color: C.text, fontFamily: mono, padding: "3px 0", borderBottom: `1px solid ${C.border}` }}>{role}</div>
        ))}
      </div>
    </div>
  );
}
