"use client";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", red: "#EF4444" };
const mono = "var(--font-mono, monospace)";

interface MarketItem {
  commodity: string;
  price: number;
  change: number;
}

export default function MarketPanel({ market }: { market: MarketItem[] }) {
  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: mono, marginBottom: 8 }}>Commodity Prices ($/MT)</div>

      {market.map(item => (
        <div key={item.commodity} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: C.bright, fontFamily: mono }}>{item.commodity}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, color: C.bright, fontFamily: mono, fontWeight: 600 }}>${item.price.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: item.change >= 0 ? C.green : C.red, fontFamily: mono }}>
              {item.change >= 0 ? "\u25B2" : "\u25BC"} {Math.abs(item.change)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
