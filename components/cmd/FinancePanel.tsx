"use client";

import type { SimulationState } from "../simulation";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", amber: "#F59E0B", red: "#EF4444", cyan: "#00D4FF", gold: "#C9A84C" };
const mono = "var(--font-mono, monospace)";

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function RevenueBar({ label, value, maxValue }: { label: string; value: number; maxValue: number }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: mono, marginBottom: 2 }}>
        <span style={{ color: C.text }}>{label}</span>
        <span style={{ color: C.bright }}>{fmt(value)}</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.cyan, borderRadius: 3 }} />
      </div>
    </div>
  );
}

export default function FinancePanel({ state }: { state: SimulationState }) {
  const { financials } = state;
  const { revenue } = financials;
  const maxRev = Math.max(revenue.storage, revenue.export, revenue.processing, revenue.wr, revenue.logistics, revenue.ca, revenue.facilitation, revenue.insurance, revenue.preCooling, revenue.cma);

  return (
    <div style={{ padding: 8, overflowY: "auto", maxHeight: "100%" }}>
      {/* P&L Summary */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>Monthly P&L</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>REVENUE</div>
            <div style={{ fontSize: 18, color: C.green, fontFamily: mono, fontWeight: 600 }}>{fmt(revenue.total)}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>OPEX</div>
            <div style={{ fontSize: 18, color: C.red, fontFamily: mono, fontWeight: 600 }}>{fmt(financials.opex)}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>EBITDA</div>
            <div style={{ fontSize: 18, color: financials.ebitda >= 0 ? C.green : C.red, fontFamily: mono, fontWeight: 600 }}>{fmt(financials.ebitda)}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>ROE (Ann.)</div>
            <div style={{ fontSize: 18, color: financials.roe >= 0 ? C.green : C.red, fontFamily: mono, fontWeight: 600 }}>{financials.roe}%</div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>Revenue Streams</div>
        <RevenueBar label="Storage Fees" value={revenue.storage} maxValue={maxRev} />
        <RevenueBar label="Export Trading" value={revenue.export} maxValue={maxRev} />
        <RevenueBar label="Processing" value={revenue.processing} maxValue={maxRev} />
        <RevenueBar label="WR Financing" value={revenue.wr} maxValue={maxRev} />
        <RevenueBar label="Logistics" value={revenue.logistics} maxValue={maxRev} />
        <RevenueBar label="Controlled Atmos." value={revenue.ca} maxValue={maxRev} />
        <RevenueBar label="CMA Fees" value={revenue.cma} maxValue={maxRev} />
        <RevenueBar label="Insurance" value={revenue.insurance} maxValue={maxRev} />
        <RevenueBar label="Facilitation" value={revenue.facilitation} maxValue={maxRev} />
        <RevenueBar label="Pre-Cooling" value={revenue.preCooling} maxValue={maxRev} />
      </div>

      {/* Cash Position */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 12 }}>
        <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>Capital Deployment</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>CASH</div><div style={{ fontSize: 14, color: C.bright, fontFamily: mono }}>{fmt(financials.cashPosition)}</div></div>
          <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>CAPEX</div><div style={{ fontSize: 14, color: C.amber, fontFamily: mono }}>{fmt(financials.capexDeployed)}</div></div>
          <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>WR CAPITAL</div><div style={{ fontSize: 14, color: C.gold, fontFamily: mono }}>{fmt(financials.wrDeployed)}</div></div>
          <div><div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>EXPORT WC</div><div style={{ fontSize: 14, color: C.cyan, fontFamily: mono }}>{fmt(financials.exportWcDeployed)}</div></div>
          <div style={{ gridColumn: "1 / -1" }}><div style={{ fontSize: 9, color: C.dim, fontFamily: mono }}>CUMULATIVE FCF</div><div style={{ fontSize: 16, color: financials.cumulativeFcf >= 0 ? C.green : C.red, fontFamily: mono }}>{fmt(financials.cumulativeFcf)}</div></div>
        </div>
      </div>
    </div>
  );
}
