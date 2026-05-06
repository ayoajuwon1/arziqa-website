"use client";

import { SimConfig, DEFAULT_CONFIG, WORST_CONFIG, BEST_CONFIG, simulate } from "../simulation";

const C = {
  bg: "#0D1117",
  card: "#161B22",
  border: "rgba(48,54,61,0.5)",
  text: "#C9D1D9",
  dim: "#6E7681",
  bright: "#F0F6FC",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#EF4444",
  cyan: "#00D4FF",
  gold: "#C9A84C",
};

const mono = "var(--font-mono, monospace)";

interface Props {
  config: SimConfig;
  onChange: (config: SimConfig) => void;
  onClose: () => void;
  baselineRevenue?: number;
  baselineEbitda?: number;
  baselineRoe?: number;
}

const HUBS = [
  { id: "kano", name: "Kano", zone: "NW" },
  { id: "makurdi", name: "Makurdi", zone: "NC" },
  { id: "ibadan", name: "Ibadan", zone: "SW" },
  { id: "gombe", name: "Gombe", zone: "NE" },
  { id: "abakaliki", name: "Abakaliki", zone: "SE" },
  { id: "calabar", name: "Calabar", zone: "SS" },
];

const EXPORTS = [
  { id: "sesame", name: "Sesame", weight: "40%" },
  { id: "cashew", name: "Cashew", weight: "30%" },
  { id: "cocoa", name: "Cocoa", weight: "20%" },
  { id: "other", name: "Other", weight: "10%" },
];

const EVENTS = [
  { id: "flood_makurdi", label: "🌊 Flood Makurdi" },
  { id: "break_truck", label: "🚛 Break Truck" },
  { id: "aflatoxin_outbreak", label: "🦠 Aflatoxin Outbreak" },
  { id: "price_crash", label: "📉 Price Crash -30%" },
  { id: "price_boom", label: "📈 Price Boom +30%" },
  { id: "ban_exports", label: "🚫 Ban All Exports" },
];

function SliderRow({ label, value, displayValue, min, max, step, onChange }: {
  label: string; value: number; displayValue: string; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
      <span style={{ fontSize: 10, color: C.text, fontFamily: mono, minWidth: 80 }}>{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: C.gold, height: 4, cursor: "pointer" }}
      />
      <span style={{ fontSize: 11, color: C.gold, fontFamily: mono, minWidth: 44, textAlign: "right", fontWeight: 600 }}>{displayValue}</span>
    </div>
  );
}

function ToggleRow({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
      <div>
        <span style={{ fontSize: 11, color: C.text, fontFamily: mono }}>{label}</span>
        {sub && <span style={{ fontSize: 9, color: C.dim, marginLeft: 6 }}>{sub}</span>}
      </div>
      <label style={{ position: "relative", width: 32, height: 18, cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{
          position: "absolute", inset: 0, borderRadius: 9,
          background: checked ? C.green : "rgba(110,118,129,0.4)",
          transition: "background 0.2s",
        }} />
        <span style={{
          position: "absolute", top: 2, left: checked ? 16 : 2, width: 14, height: 14,
          borderRadius: "50%", background: "#fff", transition: "left 0.2s",
        }} />
      </label>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.15em", padding: "12px 0 6px", borderBottom: `1px solid ${C.border}`, marginBottom: 6 }}>
      {title}
    </div>
  );
}

function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function delta(current: number, baseline: number): string {
  const diff = current - baseline;
  const pct = baseline !== 0 ? ((diff / baseline) * 100).toFixed(1) : "0.0";
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${pct}%`;
}

export default function ControlPanel({ config, onChange, onClose, baselineRevenue, baselineEbitda, baselineRoe }: Props) {
  // Compute current state for impact ticker
  const currentState = simulate(config);
  const rev = currentState.financials.revenue.total;
  const ebitda = currentState.financials.ebitda;
  const roe = currentState.financials.roe;

  const toggleEvent = (eventId: string) => {
    const events = config.manualEvents.includes(eventId)
      ? config.manualEvents.filter(e => e !== eventId)
      : [...config.manualEvents, eventId];
    onChange({ ...config, manualEvents: events });
  };

  return (
    <div style={{
      position: "fixed", left: 72, top: 44, bottom: 80, width: 400, zIndex: 100,
      background: C.bg, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", fontFamily: mono,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: "0.1em" }}>SIMULATION CONTROLS</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.dim, fontSize: 18, cursor: "pointer", fontFamily: mono, lineHeight: 1 }}>×</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px" }}>
        {/* Presets */}
        <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
          {[
            { label: "WORST", cfg: WORST_CONFIG, color: C.red },
            { label: "BASE", cfg: DEFAULT_CONFIG, color: C.cyan },
            { label: "BEST", cfg: BEST_CONFIG, color: C.green },
          ].map(p => (
            <button key={p.label} onClick={() => onChange({ ...config, ...p.cfg })} style={{
              flex: 1, padding: "6px 0", borderRadius: 4, border: `1px solid ${p.color}`,
              background: `${p.color}15`, color: p.color, fontSize: 10, fontFamily: mono,
              fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em",
            }}>{p.label}</button>
          ))}
        </div>

        {/* Revenue Sliders */}
        <SectionHeader title="Revenue Parameters" />
        <SliderRow label="Utilization" value={config.utilization * 100} displayValue={`${Math.round(config.utilization * 100)}%`} min={20} max={95} step={5} onChange={v => onChange({ ...config, utilization: v / 100 })} />
        <SliderRow label="Storage Fee" value={config.storageFee} displayValue={`$${config.storageFee}/t/mo`} min={2} max={15} step={1} onChange={v => onChange({ ...config, storageFee: v })} />
        <SliderRow label="Export Margin" value={config.exportMargin * 100} displayValue={`${Math.round(config.exportMargin * 100)}%`} min={2} max={25} step={1} onChange={v => onChange({ ...config, exportMargin: v / 100 })} />
        <SliderRow label="Export Turns" value={config.exportTurns} displayValue={`${config.exportTurns}x`} min={1} max={8} step={1} onChange={v => onChange({ ...config, exportTurns: v })} />
        <SliderRow label="WR Spread" value={config.wrSpread * 100} displayValue={`${Math.round(config.wrSpread * 100)}%`} min={5} max={25} step={1} onChange={v => onChange({ ...config, wrSpread: v / 100 })} />
        <SliderRow label="Export WC" value={config.exportWc / 1_000_000} displayValue={`$${config.exportWc / 1_000_000}M`} min={10} max={50} step={5} onChange={v => onChange({ ...config, exportWc: v * 1_000_000 })} />
        <SliderRow label="WR WC" value={config.wrWc / 1_000_000} displayValue={`$${config.wrWc / 1_000_000}M`} min={5} max={30} step={5} onChange={v => onChange({ ...config, wrWc: v * 1_000_000 })} />

        {/* Hub Toggles */}
        <SectionHeader title="Hub Toggles" />
        {HUBS.map(h => (
          <ToggleRow key={h.id} label={h.name} sub={h.zone} checked={config.hubsEnabled[h.id] !== false} onChange={v => onChange({ ...config, hubsEnabled: { ...config.hubsEnabled, [h.id]: v } })} />
        ))}

        {/* Export Toggles */}
        <SectionHeader title="Export Commodities" />
        {EXPORTS.map(e => (
          <ToggleRow key={e.id} label={e.name} sub={e.weight} checked={config.exportsEnabled[e.id] !== false} onChange={v => onChange({ ...config, exportsEnabled: { ...config.exportsEnabled, [e.id]: v } })} />
        ))}

        {/* Events */}
        <SectionHeader title="Manual Events" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {EVENTS.map(ev => {
            const active = config.manualEvents.includes(ev.id);
            return (
              <button key={ev.id} onClick={() => toggleEvent(ev.id)} style={{
                padding: "8px 6px", borderRadius: 6,
                border: `1px solid ${active ? C.amber : C.border}`,
                background: active ? "rgba(245,158,11,0.1)" : C.card,
                color: active ? C.amber : C.text,
                fontSize: 10, fontFamily: mono, cursor: "pointer", textAlign: "left",
              }}>{ev.label}</button>
            );
          })}
        </div>

        {/* Stress Tests */}
        <SectionHeader title="Stress Tests" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <button onClick={() => onChange({ ...config, utilization: 0.45, exportTurns: 2 })} style={{ padding: "6px 10px", borderRadius: 4, border: `1px solid ${C.red}`, background: "rgba(239,68,68,0.1)", color: C.red, fontSize: 10, fontFamily: mono, cursor: "pointer" }}>RECESSION</button>
          <button onClick={() => onChange({ ...config, exportsEnabled: { sesame: false, cashew: false, cocoa: false, other: false } })} style={{ padding: "6px 10px", borderRadius: 4, border: `1px solid ${C.amber}`, background: "rgba(245,158,11,0.1)", color: C.amber, fontSize: 10, fontFamily: mono, cursor: "pointer" }}>POLICY SHOCK</button>
          <button onClick={() => onChange({ ...config, utilization: 0.90, exportTurns: 6, exportMargin: 0.18 })} style={{ padding: "6px 10px", borderRadius: 4, border: `1px solid ${C.green}`, background: "rgba(34,197,94,0.1)", color: C.green, fontSize: 10, fontFamily: mono, cursor: "pointer" }}>BEST DAY</button>
        </div>
      </div>

      {/* Impact Ticker — pinned bottom */}
      <div style={{ flexShrink: 0, borderTop: `1px solid ${C.border}`, padding: "10px 16px", background: C.card }}>
        <div style={{ fontSize: 9, color: C.dim, marginBottom: 6, letterSpacing: "0.1em" }}>IMPACT VS BASELINE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div>
            <div style={{ fontSize: 9, color: C.dim }}>Revenue</div>
            <div style={{ fontSize: 13, color: C.bright, fontWeight: 600 }}>{fmt(rev)}</div>
            {baselineRevenue != null && <div style={{ fontSize: 9, color: rev >= baselineRevenue ? C.green : C.red }}>{delta(rev, baselineRevenue)}</div>}
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.dim }}>EBITDA</div>
            <div style={{ fontSize: 13, color: ebitda >= 0 ? C.green : C.red, fontWeight: 600 }}>{fmt(ebitda)}</div>
            {baselineEbitda != null && <div style={{ fontSize: 9, color: ebitda >= baselineEbitda ? C.green : C.red }}>{delta(ebitda, baselineEbitda)}</div>}
          </div>
          <div>
            <div style={{ fontSize: 9, color: C.dim }}>ROE</div>
            <div style={{ fontSize: 13, color: roe >= 0 ? C.green : C.red, fontWeight: 600 }}>{roe}%</div>
            {baselineRoe != null && <div style={{ fontSize: 9, color: roe >= baselineRoe ? C.green : C.red }}>{delta(roe, baselineRoe)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
