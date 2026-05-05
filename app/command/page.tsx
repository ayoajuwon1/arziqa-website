"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import the map component (Leaflet doesn't work with SSR)
const SimMap = dynamic(() => import("../../components/SimMap"), { ssr: false });

// ─── HUB DATA ───
const HUBS = [
  { id: "kano",      name: "Kano",      zone: "NW", lat: 12.0, lng: 8.52,  capacity: 15000, onlineMonth: 12, phase: 1, color: "#22C55E", commodities: ["Sesame","Rice","Sorghum"] },
  { id: "makurdi",   name: "Makurdi",   zone: "NC", lat: 7.73, lng: 8.53,  capacity: 12000, onlineMonth: 12, phase: 1, color: "#22C55E", commodities: ["Soybeans","Rice","Sesame"] },
  { id: "ibadan",    name: "Ibadan",    zone: "SW", lat: 7.38, lng: 3.93,  capacity: 12000, onlineMonth: 20, phase: 2, color: "#0EA5E9", commodities: ["Cocoa","Cassava","Maize"] },
  { id: "gombe",     name: "Gombe",     zone: "NE", lat: 10.29, lng: 11.17, capacity: 8000,  onlineMonth: 20, phase: 2, color: "#0EA5E9", commodities: ["Sesame","Sorghum","Groundnuts"] },
  { id: "abakaliki", name: "Abakaliki", zone: "SE", lat: 6.32, lng: 8.11,  capacity: 8000,  onlineMonth: 30, phase: 3, color: "#A855F7", commodities: ["Rice","Cassava","Palm Oil"] },
  { id: "calabar",   name: "Calabar",   zone: "SS", lat: 4.95, lng: 8.32,  capacity: 10000, onlineMonth: 30, phase: 3, color: "#A855F7", commodities: ["Palm Oil","Cocoa","Cashew"] },
];

const PORTS = [
  { id: "apapa", name: "Apapa Port (Lagos)", lat: 6.43, lng: 3.38 },
  { id: "calabar_port", name: "Calabar Port", lat: 4.97, lng: 8.33 },
];

const ROUTES = [
  { from: "kano", to: "apapa", distance: 1100, costPerMT: 100 },
  { from: "makurdi", to: "apapa", distance: 700, costPerMT: 70 },
  { from: "ibadan", to: "apapa", distance: 120, costPerMT: 20 },
  { from: "gombe", to: "calabar_port", distance: 800, costPerMT: 85 },
  { from: "abakaliki", to: "calabar_port", distance: 250, costPerMT: 35 },
  { from: "calabar", to: "calabar_port", distance: 10, costPerMT: 5 },
  { from: "makurdi", to: "kano", distance: 600, costPerMT: 60 },
];

// ─── SIMULATION ENGINE ───
function simulate(month: number) {
  const totalCapex = 173_400_000;
  const annualOpex = 4_079_272;

  // Hub statuses
  const hubs = HUBS.map(h => {
    const constructionStart = h.onlineMonth - 12;
    let status: "offline" | "construction" | "operational" = "offline";
    if (month >= h.onlineMonth) status = "operational";
    else if (month >= constructionStart) status = "construction";

    // Utilization ramp: 30% first year → target (70%) over 2 years
    let utilization = 0;
    if (status === "operational") {
      const monthsOp = month - h.onlineMonth;
      const rampProgress = Math.min(monthsOp / 24, 1);
      utilization = 0.30 + 0.40 * rampProgress;
      // Add seasonal variation
      const seasonalMonth = month % 12;
      const seasonalFactor = seasonalMonth >= 9 && seasonalMonth <= 11 ? 1.2 : seasonalMonth >= 3 && seasonalMonth <= 7 ? 0.85 : 1.0;
      utilization = Math.min(utilization * seasonalFactor, 0.92);
    }

    const stored = Math.round(h.capacity * utilization);
    const throughput = Math.round(stored * 2.5 / 12); // Monthly throughput

    return {
      ...h,
      status,
      utilization: Math.round(utilization * 100),
      stored,
      throughput,
    };
  });

  // Total capacity online
  const totalOnline = hubs.filter(h => h.status === "operational").reduce((s, h) => s + h.capacity, 0);
  const totalStored = hubs.reduce((s, h) => s + h.stored, 0);
  const totalThroughputMonthly = hubs.reduce((s, h) => s + h.throughput, 0);
  const annualThroughput = totalThroughputMonthly * 12;

  // Average utilization
  const avgUtil = totalOnline > 0 ? (totalStored / totalOnline) * 100 : 0;

  // Revenue calculation (annual rate at current month)
  const exportRamp = month < 12 ? 0 : month < 20 ? 0.3 : month < 30 ? 0.6 : 1.0;
  const wrRamp = month < 12 ? 0 : month < 24 ? 0.5 : 1.0;

  const revStorage = totalStored * 7 * 12;
  const revCA = totalOnline * 0.25 * (avgUtil / 100) * 15 * 12;
  const revProcessing = annualThroughput * 10.10;
  const revExport = 25_000_000 * 4 * 0.12 * exportRamp;
  const revWR = 15_000_000 * 1.5 * 0.15 * wrRamp;
  const revLogistics = annualThroughput * 0.30 * 25;
  const revFacilitation = annualThroughput * 0.25 * 25;
  const revOther = annualThroughput * 300 * 0.005 + annualThroughput * 0.10 * 8;

  const totalRevenue = revStorage + revCA + revProcessing + revExport + revWR + revLogistics + revFacilitation + revOther;
  const opexRamp = month < 12 ? 0.4 : month < 24 ? 0.6 : month < 36 ? 0.8 : 1.0;
  const opex = annualOpex * opexRamp;
  const ebitda = totalRevenue - opex;
  const roe = totalCapex > 0 ? (ebitda / totalCapex) * 100 : 0;

  // CapEx deployed
  const p1 = 40_300_000;
  const p2 = 31_800_000;
  const p3 = 101_300_000;
  let capexDeployed = 0;
  if (month <= 12) capexDeployed = p1 * (month / 12);
  else if (month <= 20) capexDeployed = p1 + p2 * ((month - 6) / 14);
  else if (month <= 30) capexDeployed = p1 + p2 + p3 * ((month - 14) / 16);
  else capexDeployed = totalCapex;
  capexDeployed = Math.min(capexDeployed, totalCapex);

  // Cumulative FCF (rough — sum of monthly EBITDA minus capex)
  let cumFcf = 0;
  for (let m = 1; m <= month; m++) {
    const mSim = simulate_light(m);
    cumFcf += mSim.monthlyEbitda - mSim.monthlyCapex;
  }

  // Active routes
  const activeRoutes = ROUTES.filter(r => {
    const fromHub = hubs.find(h => h.id === r.from);
    return fromHub && fromHub.status === "operational";
  });

  // Export stats
  const exportMT = Math.round(annualThroughput * 0.25 * exportRamp);
  const trucksPerMonth = Math.round(activeRoutes.length * (avgUtil / 100) * 3);

  // Phase
  const phase = month < 12 ? 1 : month < 20 ? 1 : month < 30 ? 2 : 3;
  const dateStr = getDateStr(month);

  return {
    month, hubs, totalOnline, totalStored, avgUtil, annualThroughput,
    totalRevenue, opex, ebitda, roe, capexDeployed, totalCapex,
    cumFcf, activeRoutes, exportMT, trucksPerMonth, phase, dateStr,
    revBreakdown: [
      { name: "Export Trading", value: revExport, color: "#C9A84C" },
      { name: "Storage", value: revStorage + revCA, color: "#22C55E" },
      { name: "Processing", value: revProcessing, color: "#0EA5E9" },
      { name: "WR Finance", value: revWR, color: "#A855F7" },
      { name: "Logistics", value: revLogistics + revFacilitation, color: "#F59E0B" },
      { name: "Other", value: revOther, color: "#6B7280" },
    ],
  };
}

// Light version for cumulative calculation (no recursion)
function simulate_light(month: number) {
  const totalCapex = 173_400_000;
  let monthlyCapex = 0;
  if (month <= 12) monthlyCapex = 40_300_000 / 12;
  else if (month <= 20) monthlyCapex = 31_800_000 / 14;
  else if (month <= 30) monthlyCapex = 101_300_000 / 16;

  const onlineCap = HUBS.filter(h => month >= h.onlineMonth).reduce((s, h) => s + h.capacity, 0);
  const ramp = month < 12 ? 0 : Math.min((month - 12) / 24, 1);
  const util = 0.30 + 0.40 * ramp;
  const stored = onlineCap * util;
  const throughput = stored * 2.5;

  const exportRamp = month < 12 ? 0 : month < 20 ? 0.3 : month < 30 ? 0.6 : 1.0;
  const rev = (stored * 7 * 12 + onlineCap * 0.25 * util * 15 * 12 + throughput * 10.10 + 25_000_000 * 4 * 0.12 * exportRamp + 15_000_000 * 1.5 * 0.15 * exportRamp + throughput * 0.55 * 25 + throughput * 300 * 0.005) / 12;
  const opex = (4_079_272 * (month < 12 ? 0.4 : month < 24 ? 0.6 : month < 36 ? 0.8 : 1.0)) / 12;

  return { monthlyEbitda: rev - opex, monthlyCapex };
}

function getDateStr(month: number) {
  const startYear = 2026;
  const startMonth = 10; // November (0-indexed)
  const totalMonths = startMonth + month;
  const year = startYear + Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[m]} ${year}`;
}

// Format helpers
const fmt = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};
const fmtFull = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

// ─── MAIN PAGE ───
export default function CommandPage() {
  const [month, setMonth] = useState(0);
  const [playing, setPlaying] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sim = useMemo(() => simulate(month), [month]);

  // Auto-play
  useEffect(() => {
    if (playing) {
      animRef.current = setInterval(() => {
        setMonth(m => {
          if (m >= 120) { setPlaying(false); return 120; }
          return m + 1;
        });
      }, 150);
    } else {
      if (animRef.current) clearInterval(animRef.current);
    }
    return () => { if (animRef.current) clearInterval(animRef.current); };
  }, [playing]);

  const S = {
    bg: "#0A0E14",
    card: "#0D1117",
    border: "rgba(48,54,61,0.5)",
    text: "#C9D1D9",
    dim: "#6E7681",
    bright: "#F0F6FC",
    green: "#22C55E",
    amber: "#F59E0B",
    red: "#EF4444",
    cyan: "#00D4FF",
    gold: "#C9A84C",
    purple: "#A855F7",
  };

  return (
    <div style={{ background: S.bg, color: S.text, minHeight: "100vh", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, display: "flex", flexDirection: "column" }}>

      {/* TOP BAR */}
      <div style={{ height: 48, borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: S.gold, fontSize: 16, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Arziqa</span>
          <span style={{ color: S.cyan, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>COMMAND</span>
          <span style={{ color: S.dim }}>|</span>
          <span style={{ color: S.dim }}>Simulation Engine v3.0</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: sim.totalRevenue > 0 ? S.green : S.dim }}>● {sim.totalRevenue > 0 ? "ACTIVE" : "STANDBY"}</span>
          <span style={{ color: S.gold }}>{sim.dateStr}</span>
          <span style={{ color: S.dim }}>Month {month}/120</span>
          <Link href="/" style={{ color: S.dim, fontSize: 10 }}>EXIT →</Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "280px 1fr 300px", overflow: "hidden" }}>

        {/* LEFT PANEL — HUB STATUS */}
        <div style={{ borderRight: `1px solid ${S.border}`, padding: 12, overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: S.cyan, marginBottom: 12 }}>HUB STATUS</div>
          {sim.hubs.map(h => (
            <div key={h.id} style={{ padding: 12, marginBottom: 8, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6, borderLeft: `3px solid ${h.status === "operational" ? S.green : h.status === "construction" ? S.amber : S.dim}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: S.bright, fontWeight: 600 }}>{h.name}</span>
                <span style={{ fontSize: 9, color: h.status === "operational" ? S.green : h.status === "construction" ? S.amber : S.dim, textTransform: "uppercase" }}>
                  {h.status === "operational" ? "● LIVE" : h.status === "construction" ? "◐ BUILD" : "○ OFF"}
                </span>
              </div>
              <div style={{ fontSize: 10, color: S.dim, marginBottom: 8 }}>{h.zone} · Phase {h.phase} · {h.capacity.toLocaleString()} MT</div>

              {/* Capacity bar */}
              <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginBottom: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${h.utilization}%`, background: h.status === "operational" ? S.green : S.amber, borderRadius: 3, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: S.dim }}>
                <span>{h.stored.toLocaleString()} MT stored</span>
                <span>{h.utilization}%</span>
              </div>

              {/* Commodities */}
              {h.status === "operational" && (
                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {h.commodities.map((c, i) => (
                    <span key={i} style={{ fontSize: 8, padding: "2px 6px", background: "rgba(255,255,255,0.05)", borderRadius: 3, color: S.dim }}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Fleet */}
          <div style={{ padding: 12, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6, marginTop: 8 }}>
            <div style={{ fontSize: 10, color: S.cyan, marginBottom: 6 }}>FLEET</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>🚛 Dry: {sim.trucksPerMonth > 0 ? sim.trucksPerMonth : 0} active</span>
              <span>🧊 Cold: {sim.trucksPerMonth > 2 ? 4 : 0} active</span>
            </div>
          </div>
        </div>

        {/* CENTER — MAP */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <SimMap
            hubs={sim.hubs.map(h => ({ ...h, lat: h.lat, lng: h.lng }))}
            ports={PORTS}
            routes={sim.activeRoutes.map(r => ({
              from: [...HUBS, ...PORTS].find(n => n.id === r.from)!,
              to: [...HUBS, ...PORTS].find(n => n.id === r.to)!,
              active: true,
            }))}
            month={month}
          />

          {/* Map overlay stats */}
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 1000, background: "rgba(10,14,20,0.85)", padding: "12px 16px", borderRadius: 8, border: `1px solid ${S.border}`, backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 10, color: S.cyan, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>PHASE {sim.phase} · {sim.hubs.filter(h => h.status === "operational").length}/6 HUBS ONLINE</div>
            <div style={{ fontSize: 18, color: S.bright }}>{sim.totalStored.toLocaleString()} MT</div>
            <div style={{ fontSize: 9, color: S.dim }}>stored across network · {pct(sim.avgUtil)} avg utilization</div>
          </div>

          {/* Phase timeline on map */}
          <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, zIndex: 1000, background: "rgba(10,14,20,0.85)", padding: "8px 16px", borderRadius: 8, border: `1px solid ${S.border}`, display: "flex", gap: 16, justifyContent: "center" }}>
            {[
              { label: "Phase 1", months: "M0-12", hubs: "Kano + Makurdi", active: month >= 0 },
              { label: "Phase 2", months: "M6-20", hubs: "Ibadan + Gombe", active: month >= 6 },
              { label: "Phase 3", months: "M14-30", hubs: "Abakaliki + Calabar", active: month >= 14 },
            ].map((p, i) => (
              <div key={i} style={{ textAlign: "center", opacity: p.active ? 1 : 0.3 }}>
                <div style={{ fontSize: 10, color: p.active ? S.cyan : S.dim, fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontSize: 8, color: S.dim }}>{p.hubs}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — FINANCIALS */}
        <div style={{ borderLeft: `1px solid ${S.border}`, padding: 12, overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: S.gold, marginBottom: 12 }}>FINANCIALS (ANNUAL RATE)</div>

          {/* Key metrics */}
          {[
            { label: "REVENUE", value: fmtFull(sim.totalRevenue), color: sim.totalRevenue > 0 ? S.green : S.dim },
            { label: "EBITDA", value: fmtFull(sim.ebitda), color: sim.ebitda > 0 ? S.green : S.red },
            { label: "ROE", value: pct(sim.roe), color: sim.roe > 12 ? S.green : sim.roe > 8 ? S.amber : S.dim },
            { label: "OPEX", value: fmtFull(sim.opex), color: S.dim },
          ].map((m, i) => (
            <div key={i} style={{ padding: "10px 12px", marginBottom: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6 }}>
              <div style={{ fontSize: 9, color: S.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 20, color: m.color, fontWeight: 600, transition: "color 0.3s" }}>{m.value}</div>
            </div>
          ))}

          {/* Throughput gauge */}
          <div style={{ padding: 12, marginBottom: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: S.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>THROUGHPUT</div>
            <div style={{ fontSize: 16, color: S.bright }}>{sim.annualThroughput.toLocaleString()} MT/yr</div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((sim.annualThroughput / 200000) * 100, 100)}%`, background: S.cyan, borderRadius: 3, transition: "width 0.5s" }} />
            </div>
          </div>

          {/* Export */}
          <div style={{ padding: 12, marginBottom: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: S.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>EXPORT TRADING</div>
            <div style={{ fontSize: 16, color: S.gold }}>{fmt(sim.revBreakdown[0]?.value || 0)}/yr</div>
            <div style={{ fontSize: 9, color: S.dim, marginTop: 4 }}>{sim.exportMT.toLocaleString()} MT exported · {sim.activeRoutes.length} routes active</div>
          </div>

          {/* CapEx deployed */}
          <div style={{ padding: 12, marginBottom: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: S.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>CAPEX DEPLOYED</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 16, color: S.bright }}>{fmt(sim.capexDeployed)}</span>
              <span style={{ fontSize: 10, color: S.dim }}>/ {fmt(sim.totalCapex)}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(sim.capexDeployed / sim.totalCapex) * 100}%`, background: S.gold, borderRadius: 3, transition: "width 0.5s" }} />
            </div>
          </div>

          {/* Cumulative FCF */}
          <div style={{ padding: 12, marginBottom: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: S.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>CUMULATIVE FCF</div>
            <div style={{ fontSize: 16, color: sim.cumFcf > 0 ? S.green : S.red }}>{fmtFull(Math.round(sim.cumFcf))}</div>
            <div style={{ fontSize: 9, color: S.dim, marginTop: 4 }}>{sim.cumFcf > 0 ? "✓ Payback achieved" : `${fmt(Math.abs(sim.cumFcf))} to payback`}</div>
          </div>

          {/* Revenue breakdown */}
          <div style={{ padding: 12, background: S.card, border: `1px solid ${S.border}`, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: S.dim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>REVENUE MIX</div>
            {sim.revBreakdown.filter(r => r.value > 0).map((r, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 2 }}>
                  <span style={{ color: S.dim }}>{r.name}</span>
                  <span style={{ color: r.color }}>{fmt(r.value)}</span>
                </div>
                <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${sim.totalRevenue > 0 ? (r.value / sim.totalRevenue) * 100 : 0}%`, background: r.color, borderRadius: 2, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM — TIME CONTROL */}
      <div style={{ height: 100, borderTop: `1px solid ${S.border}`, padding: "12px 20px", flexShrink: 0, background: S.card }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <button onClick={() => setPlaying(!playing)} style={{
            padding: "6px 16px", background: playing ? S.red : S.green, color: "#000", border: "none",
            borderRadius: 4, fontFamily: "monospace", fontSize: 11, cursor: "pointer", fontWeight: 700,
          }}>
            {playing ? "■ STOP" : "▶ PLAY"}
          </button>
          <button onClick={() => setMonth(0)} style={{ padding: "6px 12px", background: "transparent", border: `1px solid ${S.border}`, color: S.dim, borderRadius: 4, fontFamily: "monospace", fontSize: 10, cursor: "pointer" }}>
            RESET
          </button>
          <span style={{ color: S.gold, fontSize: 14, fontWeight: 600, minWidth: 120 }}>{sim.dateStr}</span>
          <span style={{ color: S.dim, fontSize: 10 }}>Month {month} · Phase {sim.phase}</span>

          {/* Phase markers */}
          <div style={{ flex: 1, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {[
              { label: "FC", month: 0, color: S.dim },
              { label: "P1", month: 12, color: S.green },
              { label: "P2", month: 20, color: S.cyan },
              { label: "P3", month: 30, color: S.purple },
              { label: "Y5", month: 60, color: S.gold },
              { label: "Y10", month: 120, color: S.gold },
            ].map((m, i) => (
              <button key={i} onClick={() => { setPlaying(false); setMonth(m.month); }} style={{
                padding: "4px 8px", background: month >= m.month ? "rgba(255,255,255,0.05)" : "transparent",
                border: `1px solid ${month >= m.month ? m.color : S.border}`, color: month >= m.month ? m.color : S.dim,
                borderRadius: 4, fontFamily: "monospace", fontSize: 9, cursor: "pointer",
              }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <input type="range" min={0} max={120} value={month}
          onChange={e => { setPlaying(false); setMonth(Number(e.target.value)); }}
          style={{ width: "100%", accentColor: S.gold, cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
