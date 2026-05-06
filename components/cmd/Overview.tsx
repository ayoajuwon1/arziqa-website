"use client";

import type { SimulationState } from "../simulation";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", amber: "#F59E0B", red: "#EF4444", cyan: "#00D4FF" };

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
      <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4, fontFamily: "var(--font-mono, monospace)" }}>{label}</div>
      <div style={{ fontSize: 20, color: color || C.bright, fontFamily: "var(--font-mono, monospace)", fontWeight: 600 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.dim, marginTop: 2, fontFamily: "var(--font-mono, monospace)" }}>{sub}</div>}
    </div>
  );
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default function Overview({ state }: { state: SimulationState }) {
  const { financials, throughput, receipts, trucks, exports: deals } = state;
  const activeTrucks = trucks.filter(t => t.status === "en_route" || t.status === "loading" || t.status === "unloading").length;
  const faultyTrucks = trucks.filter(t => t.status === "faulty").length;
  const totalStored = state.hubs.reduce((s, h) => s + h.stored, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 8 }}>
      <MetricCard label="Revenue (Monthly)" value={fmt(financials.revenue.total)} color={C.green} />
      <MetricCard label="EBITDA" value={fmt(financials.ebitda)} color={financials.ebitda > 0 ? C.green : C.red} />
      <MetricCard label="ROE" value={`${financials.roe}%`} color={financials.roe > 0 ? C.green : C.red} />
      <MetricCard label="Throughput" value={`${throughput.monthly.toLocaleString()} MT`} sub="monthly" />
      <MetricCard label="Stock in Hubs" value={`${totalStored.toLocaleString()} MT`} />
      <MetricCard label="Active Trucks" value={`${activeTrucks}`} sub={faultyTrucks > 0 ? `${faultyTrucks} faulty` : undefined} color={faultyTrucks > 0 ? C.amber : C.cyan} />
      <MetricCard label="Export Deals" value={`${deals.length}`} sub={`${deals.filter(d => d.stage === "shipped").length} shipped`} />
      <MetricCard label="Receipts Issued" value={`${receipts.issued}`} sub={`${receipts.financed} financed`} />
      <MetricCard label="Cash Position" value={fmt(financials.cashPosition)} color={C.cyan} />
      <MetricCard label="CapEx Deployed" value={fmt(financials.capexDeployed)} />
      <MetricCard label="WR Deployed" value={fmt(financials.wrDeployed)} />
      <MetricCard label="Export WC" value={fmt(financials.exportWcDeployed)} />
    </div>
  );
}
