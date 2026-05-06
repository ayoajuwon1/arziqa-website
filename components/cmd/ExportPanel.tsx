"use client";

import type { ExportDeal } from "../simulation";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", amber: "#F59E0B", red: "#EF4444", cyan: "#00D4FF", gold: "#C9A84C", purple: "#A855F7" };
const mono = "var(--font-mono, monospace)";

const stageColors: Record<string, string> = {
  negotiation: C.dim, confirmed: C.amber, processing: C.cyan, containerised: C.purple, shipped: C.green, paid: C.gold,
};

const stageOrder: ExportDeal["stage"][] = ["negotiation", "confirmed", "processing", "containerised", "shipped", "paid"];

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function ExportPanel({ deals }: { deals: ExportDeal[] }) {
  return (
    <div style={{ padding: 8, overflowY: "auto", maxHeight: "100%" }}>
      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: mono, marginBottom: 8 }}>Export Pipeline ({deals.length} deals)</div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {stageOrder.map(stage => {
          const count = deals.filter(d => d.stage === stage).length;
          return (
            <div key={stage} style={{ background: `${stageColors[stage]}15`, border: `1px solid ${stageColors[stage]}40`, borderRadius: 4, padding: "4px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 14, color: stageColors[stage], fontFamily: mono, fontWeight: 600 }}>{count}</div>
              <div style={{ fontSize: 8, color: C.dim, fontFamily: mono, textTransform: "uppercase" }}>{stage.slice(0, 6)}</div>
            </div>
          );
        })}
      </div>

      {/* Deal cards */}
      {stageOrder.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage);
        if (stageDeals.length === 0) return null;
        return (
          <div key={stage} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: stageColors[stage], fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4, paddingLeft: 4 }}>{stage}</div>
            {stageDeals.map(deal => (
              <div key={deal.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${stageColors[stage]}`, borderRadius: 4, padding: 8, marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: C.bright, fontFamily: mono }}>{deal.buyer}</div>
                    <div style={{ fontSize: 10, color: C.text, fontFamily: mono }}>{deal.tonnage} MT {deal.commodity}</div>
                  </div>
                  <div style={{ fontSize: 12, color: C.gold, fontFamily: mono, fontWeight: 600 }}>{fmt(deal.value)}</div>
                </div>
                {deal.vessel && <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, marginTop: 4 }}>{deal.vessel} · ETA {deal.eta}</div>}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
