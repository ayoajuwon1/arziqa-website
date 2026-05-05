"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface HubData {
  name: string;
  zone: string;
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
  capacity: number;
  onlineMonth: number;
  phase: number;
  commodities: { name: string; pct: number }[];
}

interface SimState {
  month: number;
  hubs: {
    name: string;
    zone: string;
    status: "offline" | "construction" | "operational";
    utilization: number;
    stored: number;
    capacity: number;
    commodities: { name: string; mt: number }[];
  }[];
  revenue: number;
  ebitda: number;
  roe: number;
  throughputMT: number;
  throughputPct: number;
  exportRevenue: number;
  exportMT: number;
  cumulativeFcf: number;
  capexDeployed: number;
  totalCapex: number;
  revenueBreakdown: { label: string; pct: number; amount: number }[];
  activeRoutes: number;
  trucksActive: number;
  phase: number;
  paybackYear: number | null;
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

const HUBS: HubData[] = [
  { name: "Kano", zone: "NW", lat: 12.0, lng: 8.52, svgX: 310, svgY: 105, capacity: 15000, onlineMonth: 12, phase: 1, commodities: [{ name: "Sesame", pct: 0.28 }, { name: "Sorghum", pct: 0.21 }, { name: "Rice", pct: 0.16 }] },
  { name: "Gombe", zone: "NE", lat: 10.29, lng: 11.17, svgX: 430, svgY: 145, capacity: 12000, onlineMonth: 20, phase: 2, commodities: [{ name: "Groundnut", pct: 0.30 }, { name: "Maize", pct: 0.25 }, { name: "Sesame", pct: 0.18 }] },
  { name: "Makurdi", zone: "NC", lat: 7.73, lng: 8.54, svgX: 370, svgY: 255, capacity: 15000, onlineMonth: 12, phase: 1, commodities: [{ name: "Soybeans", pct: 0.32 }, { name: "Rice", pct: 0.22 }, { name: "Sesame", pct: 0.15 }] },
  { name: "Ibadan", zone: "SW", lat: 7.38, lng: 3.94, svgX: 195, svgY: 270, capacity: 12000, onlineMonth: 20, phase: 2, commodities: [{ name: "Cocoa", pct: 0.35 }, { name: "Cashew", pct: 0.22 }, { name: "Maize", pct: 0.14 }] },
  { name: "Abakaliki", zone: "SE", lat: 6.33, lng: 8.11, svgX: 370, svgY: 320, capacity: 10000, onlineMonth: 30, phase: 3, commodities: [{ name: "Rice", pct: 0.38 }, { name: "Cassava", pct: 0.20 }, { name: "Yam", pct: 0.14 }] },
  { name: "Calabar", zone: "SS", lat: 4.95, lng: 8.32, svgX: 400, svgY: 385, capacity: 10000, onlineMonth: 30, phase: 3, commodities: [{ name: "Cocoa", pct: 0.30 }, { name: "Palm Oil", pct: 0.25 }, { name: "Rubber", pct: 0.12 }] },
];

const PORTS = [
  { name: "Apapa (Lagos)", svgX: 155, svgY: 330 },
  { name: "Calabar Port", svgX: 415, svgY: 405 },
];

const ROUTES: { from: number; to: string; toX: number; toY: number; dist: string; cost: string }[] = [
  { from: 0, to: "Apapa", toX: 155, toY: 330, dist: "1,100km", cost: "$100/MT" },
  { from: 1, to: "Apapa", toX: 155, toY: 330, dist: "1,400km", cost: "$125/MT" },
  { from: 2, to: "Apapa", toX: 155, toY: 330, dist: "800km", cost: "$82/MT" },
  { from: 3, to: "Apapa", toX: 155, toY: 330, dist: "130km", cost: "$22/MT" },
  { from: 4, to: "Calabar Port", toX: 415, toY: 405, dist: "280km", cost: "$38/MT" },
  { from: 5, to: "Calabar Port", toX: 415, toY: 405, dist: "60km", cost: "$12/MT" },
  { from: 2, to: "Kano (Consol.)", toX: 310, toY: 105, dist: "650km", cost: "$68/MT" },
];

const COMMODITIES_TICKER = [
  { name: "SESAME", price: 1850, change: 2.3 },
  { name: "CASHEW", price: 3500, change: 1.1 },
  { name: "COCOA", price: 3800, change: -0.5 },
  { name: "SOYBEANS", price: 490, change: 3.2 },
  { name: "MAIZE", price: 337, change: 1.8 },
  { name: "GROUNDNUT", price: 620, change: 0.7 },
  { name: "RICE", price: 480, change: -1.2 },
  { name: "PALM OIL", price: 1120, change: 2.8 },
  { name: "RUBBER", price: 1650, change: -0.3 },
  { name: "YAM", price: 290, change: 1.5 },
];

const TOTAL_CAPEX = 173_400_000;

// Nigeria SVG outline (simplified)
const NIGERIA_PATH = "M 130 120 L 180 95 L 230 85 L 280 80 L 320 78 L 370 82 L 420 90 L 470 110 L 490 140 L 485 180 L 478 220 L 470 260 L 458 300 L 445 340 L 430 370 L 420 395 L 405 410 L 380 400 L 350 380 L 320 365 L 290 355 L 260 340 L 230 330 L 200 325 L 170 330 L 150 340 L 140 330 L 135 305 L 130 280 L 120 250 L 115 220 L 118 190 L 122 160 Z";

// ─── SIMULATION ENGINE ─────────────────────────────────────────────────────────

function simulate(month: number): SimState {
  const hubStates = HUBS.map((hub) => {
    let status: "offline" | "construction" | "operational" = "offline";
    let utilization = 0;

    if (month >= hub.onlineMonth) {
      status = "operational";
      const monthsSinceOnline = month - hub.onlineMonth;
      // Ramp: 30% → target over 24 months, max ~85%
      const rampTarget = 0.85;
      const rampStart = 0.30;
      const rampProgress = Math.min(monthsSinceOnline / 24, 1);
      utilization = rampStart + (rampTarget - rampStart) * (1 - Math.pow(1 - rampProgress, 2));
      // Seasonal variation: +/- 8%
      utilization += 0.08 * Math.sin((month / 12) * Math.PI * 2);
      utilization = Math.max(0.15, Math.min(0.95, utilization));
    } else if (month >= hub.onlineMonth - 8) {
      status = "construction";
    }

    const stored = Math.round(hub.capacity * utilization);
    const commodities = hub.commodities.map((c) => ({
      name: c.name,
      mt: Math.round(stored * c.pct),
    }));

    return {
      name: hub.name,
      zone: hub.zone,
      status,
      utilization,
      stored,
      capacity: hub.capacity,
      commodities,
    };
  });

  const operationalHubs = hubStates.filter((h) => h.status === "operational");
  const totalCapacity = operationalHubs.reduce((s, h) => s + h.capacity, 0);
  const totalStored = operationalHubs.reduce((s, h) => s + h.stored, 0);
  const avgUtil = totalCapacity > 0 ? totalStored / totalCapacity : 0;

  // Throughput: annualized (4 turns per year)
  const annualThroughput = totalStored * 4;
  const maxThroughput = 74000 * 4; // full platform max
  const throughputPct = maxThroughput > 0 ? annualThroughput / maxThroughput : 0;

  // Revenue model
  const storageRev = totalStored * 4 * 18; // $18/MT/turn storage fee
  const exportMT = Math.round(annualThroughput * 0.35);
  const exportMargin = 0.12;
  const avgExportPrice = 1200;
  const exportRevenue = exportMT * avgExportPrice * exportMargin;
  const caRevenue = totalStored * 0.4 * 320 * 0.04; // 40% collateralized, $320/MT avg, 4% fee
  const wrRevenue = totalStored * 0.3 * 280 * 0.035; // 30% WR financed
  const processingRev = annualThroughput * 0.1 * 45; // 10% processed, $45 margin
  const otherRev = annualThroughput * 8; // ancillary services

  const revenue = storageRev + exportRevenue + caRevenue + wrRevenue + processingRev + otherRev;

  const revenueBreakdown = [
    { label: "Export", pct: revenue > 0 ? exportRevenue / revenue : 0, amount: exportRevenue },
    { label: "Storage", pct: revenue > 0 ? storageRev / revenue : 0, amount: storageRev },
    { label: "CA", pct: revenue > 0 ? caRevenue / revenue : 0, amount: caRevenue },
    { label: "WR", pct: revenue > 0 ? wrRevenue / revenue : 0, amount: wrRevenue },
    { label: "Other", pct: revenue > 0 ? (processingRev + otherRev) / revenue : 0, amount: processingRev + otherRev },
  ];

  // EBITDA: ~85% margin on storage/CA/WR, ~12% on export, ~60% on processing
  const ebitda = storageRev * 0.85 + exportRevenue * 0.95 + caRevenue * 0.90 + wrRevenue * 0.88 + processingRev * 0.60 + otherRev * 0.70;

  // CapEx phasing
  let capexDeployed = 0;
  if (month <= 12) capexDeployed = (month / 12) * 65_000_000;
  else if (month <= 20) capexDeployed = 65_000_000 + ((month - 12) / 8) * 52_000_000;
  else if (month <= 30) capexDeployed = 117_000_000 + ((month - 20) / 10) * 42_000_000;
  else capexDeployed = 159_000_000 + Math.min((month - 30) / 12, 1) * 14_400_000;
  capexDeployed = Math.min(capexDeployed, TOTAL_CAPEX);

  // Cumulative FCF (simplified): revenue - opex - capex in period
  // We do a rough running calc
  let cumulativeFcf = -capexDeployed;
  if (month > 12) {
    const opMonths = month - 12;
    const avgAnnualFcf = ebitda * 0.65; // after debt service, tax
    cumulativeFcf += (avgAnnualFcf / 12) * opMonths;
  }

  // ROE
  const equity = 52_000_000; // $52M equity
  const roe = equity > 0 ? (ebitda * 0.55) / equity : 0; // after tax + interest approx

  // Phase
  let phase = 0;
  if (month >= 30) phase = 3;
  else if (month >= 20) phase = 2;
  else if (month >= 12) phase = 1;
  else if (month >= 4) phase = 0.5; // construction

  // Payback
  let paybackYear: number | null = null;
  for (let m = 12; m <= 120; m++) {
    let testFcf = -Math.min(TOTAL_CAPEX, capexDeployed);
    const testOpMonths = m - 12;
    const testAvgFcf = ebitda * 0.65;
    testFcf += (testAvgFcf / 12) * testOpMonths;
    if (testFcf >= 0) {
      paybackYear = Math.ceil(m / 12);
      break;
    }
  }

  const activeRoutes = operationalHubs.length > 0 ? Math.min(ROUTES.length, operationalHubs.length + 1) : 0;
  const trucksActive = Math.round(annualThroughput / 30 / 12); // trucks per month approx

  return {
    month,
    hubs: hubStates,
    revenue,
    ebitda,
    roe,
    throughputMT: annualThroughput,
    throughputPct,
    exportRevenue,
    exportMT,
    cumulativeFcf,
    capexDeployed,
    totalCapex: TOTAL_CAPEX,
    revenueBreakdown,
    activeRoutes,
    trucksActive,
    phase,
    paybackYear,
  };
}

// ─── FORMATTING HELPERS ────────────────────────────────────────────────────────

function fmt$(n: number): string {
  if (Math.abs(n) >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K";
  return "$" + n.toFixed(0);
}

function fmtFull$(n: number): string {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(Math.round(n)).toLocaleString();
}

function fmtMT(n: number): string {
  return n.toLocaleString() + " MT";
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

function monthToDate(month: number): string {
  const baseYear = 2026;
  const baseMonth = 10; // November = 10 (0-indexed)
  const totalMonths = baseMonth + month;
  const year = baseYear + Math.floor(totalMonths / 12);
  const mo = totalMonths % 12;
  const names = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return names[mo] + " " + year;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function CommandCenter() {
  const [month, setMonth] = useState(36);
  const [hoveredHub, setHoveredHub] = useState<number | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);
  const [time, setTime] = useState("");
  const tickerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const [displayValues, setDisplayValues] = useState<{revenue: number; ebitda: number; throughput: number}>({revenue: 0, ebitda: 0, throughput: 0});

  const sim = useMemo(() => simulate(month), [month]);

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }) + "." + String(now.getMilliseconds()).padStart(3, "0").slice(0, 2));
    };
    tick();
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, []);

  // Smooth number transitions
  useEffect(() => {
    const target = { revenue: sim.revenue, ebitda: sim.ebitda, throughput: sim.throughputMT };
    const start = { ...displayValues };
    const startTime = performance.now();
    const duration = 400;

    function animate(t: number) {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValues({
        revenue: start.revenue + (target.revenue - start.revenue) * ease,
        ebitda: start.ebitda + (target.ebitda - start.ebitda) * ease,
        throughput: start.throughput + (target.throughput - start.throughput) * ease,
      });
      if (progress < 1) animFrameRef.current = requestAnimationFrame(animate);
    }
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim.revenue, sim.ebitda, sim.throughputMT]);

  const statusColor = (s: string) => s === "operational" ? "#22C55E" : s === "construction" ? "#F59E0B" : "#3B4048";
  const statusGlow = (s: string) => s === "operational" ? "0 0 12px rgba(34,197,94,0.5)" : s === "construction" ? "0 0 8px rgba(245,158,11,0.3)" : "none";

  return (
    <div style={{
      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
      background: "#0A0E14",
      color: "#C9D1D9",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontSize: "11px",
      lineHeight: 1.4,
    }}>

      {/* ── TOP BAR ────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(48,54,61,0.5)",
        background: "#0D1117",
        flexShrink: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>ARZIQA</span>
          <span style={{ color: "#6E7681" }}>COMMAND</span>
          <span style={{ color: "#3B4048" }}>·</span>
          <span style={{ color: "#00D4FF", fontSize: 10 }}>SIMULATION ENGINE v2.1</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#6E7681", fontSize: 10 }}>SIM TIME</span>
          <span style={{ color: "#F0F6FC", fontWeight: 500 }}>{monthToDate(month)}</span>
          <span style={{ color: "#3B4048" }}>·</span>
          <span style={{ color: "#6E7681", fontSize: 10 }}>CLOCK</span>
          <span style={{ color: "#00D4FF", fontVariantNumeric: "tabular-nums" }}>{time}</span>
          <span style={{ color: "#3B4048" }}>·</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            color: "#22C55E", fontSize: 10,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#22C55E",
              boxShadow: "0 0 6px rgba(34,197,94,0.6)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            ONLINE
          </span>
          <span style={{ color: "#3B4048" }}>·</span>
          <Link href="/" style={{ color: "#6E7681", textDecoration: "none", fontSize: 10 }}>EXIT → MAIN SITE</Link>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr 260px",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}>

        {/* ── LEFT PANEL: HUB STATUS ─────────────────────────────────────── */}
        <div style={{
          borderRight: "1px solid rgba(48,54,61,0.5)",
          padding: "8px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}>
          <div style={{ color: "#6E7681", fontSize: 9, letterSpacing: 2, padding: "4px 0", textTransform: "uppercase" }}>Hub Network Status</div>

          {sim.hubs.map((hub, i) => (
            <div key={hub.name} style={{
              background: hoveredHub === i ? "#161B22" : "#0D1117",
              border: `1px solid ${hoveredHub === i ? "rgba(0,212,255,0.3)" : "rgba(48,54,61,0.5)"}`,
              borderRadius: 4,
              padding: "8px 10px",
              cursor: "default",
              transition: "all 0.2s",
            }}
              onMouseEnter={() => setHoveredHub(i)}
              onMouseLeave={() => setHoveredHub(null)}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: statusColor(hub.status),
                    boxShadow: statusGlow(hub.status),
                    display: "inline-block",
                  }} />
                  <span style={{ color: "#F0F6FC", fontWeight: 600, fontSize: 12 }}>{hub.name}</span>
                  <span style={{ color: "#6E7681", fontSize: 9 }}>({hub.zone})</span>
                </div>
                <span style={{ color: "#C9D1D9", fontSize: 10 }}>{fmtMT(hub.capacity)}</span>
              </div>

              {/* Capacity bar */}
              <div style={{
                height: 4, background: "rgba(48,54,61,0.5)", borderRadius: 2, overflow: "hidden", marginBottom: 4,
              }}>
                <div style={{
                  height: "100%",
                  width: `${hub.utilization * 100}%`,
                  background: hub.status === "operational"
                    ? `linear-gradient(90deg, #0EA5E9, #00D4FF)`
                    : hub.status === "construction" ? "#F59E0B" : "#3B4048",
                  borderRadius: 2,
                  transition: "width 0.4s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "#6E7681", fontSize: 9 }}>{fmtPct(hub.utilization)} util</span>
                <span style={{ color: "#6E7681", fontSize: 9 }}>{fmtMT(hub.stored)} stored</span>
              </div>

              {/* Commodities */}
              {hub.commodities.map((c) => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#6E7681" }}>
                  <span>{c.name}</span>
                  <span style={{ color: "#C9D1D9" }}>{c.mt.toLocaleString()} MT</span>
                </div>
              ))}

              <div style={{ marginTop: 4, fontSize: 9, color: statusColor(hub.status), textTransform: "uppercase", letterSpacing: 1 }}>
                {hub.status === "operational" ? "● OPERATIONAL" : hub.status === "construction" ? "◐ CONSTRUCTION" : "○ OFFLINE"}
              </div>
            </div>
          ))}

          {/* Fleet status */}
          <div style={{
            background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)",
            borderRadius: 4, padding: "8px 10px", marginTop: 4,
          }}>
            <div style={{ color: "#6E7681", fontSize: 9, letterSpacing: 1, marginBottom: 4 }}>FLEET STATUS</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
              <span style={{ color: "#C9D1D9" }}>{sim.trucksActive} TRUCKS</span>
              <span style={{ color: "#22C55E" }}>{sim.activeRoutes} ROUTES</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 9, color: "#6E7681" }}>
              <span>DRY: {Math.round(sim.trucksActive * 0.75)}/{Math.round(sim.trucksActive * 0.75)}</span>
              <span>COLD: {Math.round(sim.trucksActive * 0.25)}/{Math.round(sim.trucksActive * 0.25)}</span>
            </div>
          </div>
        </div>

        {/* ── CENTER: NIGERIA MAP ─────────────────────────────────────────── */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "radial-gradient(ellipse at center, rgba(0,212,255,0.03) 0%, transparent 70%)",
        }}>
          <svg viewBox="60 50 480 400" style={{ width: "100%", maxHeight: "100%", padding: 16 }}>
            {/* Grid lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`gv${i}`} x1={60 + i * 25} y1={50} x2={60 + i * 25} y2={450} stroke="rgba(48,54,61,0.15)" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`gh${i}`} x1={60} y1={50 + i * 25} x2={540} y2={50 + i * 25} stroke="rgba(48,54,61,0.15)" strokeWidth={0.5} />
            ))}

            {/* Nigeria outline */}
            <path d={NIGERIA_PATH} fill="rgba(0,212,255,0.04)" stroke="rgba(0,212,255,0.2)" strokeWidth={1.5} />

            {/* Routes */}
            {ROUTES.map((route, ri) => {
              const hub = HUBS[route.from];
              const hubState = sim.hubs[route.from];
              const isActive = hubState.status === "operational";
              const isHovered = hoveredRoute === ri;

              return (
                <g key={`route-${ri}`}
                  onMouseEnter={() => setHoveredRoute(ri)}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  {/* Route line */}
                  <line
                    x1={hub.svgX} y1={hub.svgY}
                    x2={route.toX} y2={route.toY}
                    stroke={isActive ? (isHovered ? "#00D4FF" : "rgba(0,212,255,0.25)") : "rgba(48,54,61,0.2)"}
                    strokeWidth={isHovered ? 2 : 1}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    style={{ transition: "all 0.3s", filter: isActive && isHovered ? "drop-shadow(0 0 4px rgba(0,212,255,0.5))" : "none" }}
                  />

                  {/* Animated dots along route */}
                  {isActive && Array.from({ length: Math.max(1, Math.round(hubState.utilization * 3)) }).map((_, di) => (
                    <circle key={`dot-${ri}-${di}`} r={2}
                      fill="#00D4FF"
                      style={{
                        filter: "drop-shadow(0 0 3px rgba(0,212,255,0.8))",
                      }}
                    >
                      <animateMotion
                        dur={`${4 + di * 1.5}s`}
                        begin={`${di * 1.2}s`}
                        repeatCount="indefinite"
                        path={`M${hub.svgX},${hub.svgY} L${route.toX},${route.toY}`}
                      />
                    </circle>
                  ))}

                  {/* Route tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={(hub.svgX + route.toX) / 2 - 60}
                        y={(hub.svgY + route.toY) / 2 - 20}
                        width={120} height={32} rx={3}
                        fill="#161B22" stroke="rgba(0,212,255,0.4)" strokeWidth={1}
                      />
                      <text
                        x={(hub.svgX + route.toX) / 2}
                        y={(hub.svgY + route.toY) / 2 - 6}
                        textAnchor="middle" fill="#C9D1D9" fontSize={8}
                        fontFamily="var(--font-mono), monospace"
                      >
                        {hub.name} → {route.to}
                      </text>
                      <text
                        x={(hub.svgX + route.toX) / 2}
                        y={(hub.svgY + route.toY) / 2 + 6}
                        textAnchor="middle" fill="#6E7681" fontSize={7}
                        fontFamily="var(--font-mono), monospace"
                      >
                        {route.dist} · {route.cost}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Farm collection zones (small dotted circles) */}
            {HUBS.map((hub, i) => {
              const isActive = sim.hubs[i].status === "operational";
              return isActive ? (
                <circle key={`farm-${i}`} cx={hub.svgX} cy={hub.svgY} r={30}
                  fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth={0.5} strokeDasharray="3 3"
                />
              ) : null;
            })}

            {/* Port nodes */}
            {PORTS.map((port) => (
              <g key={port.name}>
                <rect x={port.svgX - 6} y={port.svgY - 6} width={12} height={12} rx={2}
                  fill="#161B22" stroke="rgba(0,212,255,0.4)" strokeWidth={1}
                />
                <text x={port.svgX} y={port.svgY + 18} textAnchor="middle" fill="#00D4FF" fontSize={7}
                  fontFamily="var(--font-mono), monospace"
                >
                  ⚓ {port.name}
                </text>
              </g>
            ))}

            {/* Hub nodes */}
            {HUBS.map((hub, i) => {
              const state = sim.hubs[i];
              const color = statusColor(state.status);
              const isHovered = hoveredHub === i;
              const baseRadius = 8 + (hub.capacity / 15000) * 6;

              return (
                <g key={hub.name}
                  onMouseEnter={() => setHoveredHub(i)}
                  onMouseLeave={() => setHoveredHub(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Outer glow ring */}
                  {state.status === "operational" && (
                    <circle cx={hub.svgX} cy={hub.svgY} r={baseRadius + 6}
                      fill="none" stroke={color} strokeWidth={0.5} opacity={0.3}
                    >
                      <animate attributeName="r" values={`${baseRadius + 4};${baseRadius + 10};${baseRadius + 4}`} dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Hub circle */}
                  <circle cx={hub.svgX} cy={hub.svgY} r={baseRadius}
                    fill={state.status === "operational" ? `${color}22` : "#0D1117"}
                    stroke={color} strokeWidth={isHovered ? 2 : 1.5}
                    style={{
                      filter: state.status === "operational" ? `drop-shadow(0 0 6px ${color}66)` : "none",
                      transition: "all 0.3s",
                    }}
                  />

                  {/* Utilization fill (pie-style) */}
                  {state.utilization > 0 && (
                    <circle cx={hub.svgX} cy={hub.svgY} r={baseRadius - 2}
                      fill="none" stroke={color} strokeWidth={3}
                      strokeDasharray={`${state.utilization * 2 * Math.PI * (baseRadius - 2)} ${2 * Math.PI * (baseRadius - 2)}`}
                      transform={`rotate(-90 ${hub.svgX} ${hub.svgY})`}
                      opacity={0.6}
                    />
                  )}

                  {/* Label */}
                  <text x={hub.svgX} y={hub.svgY - baseRadius - 6}
                    textAnchor="middle" fill="#F0F6FC" fontSize={9} fontWeight={600}
                    fontFamily="var(--font-mono), monospace"
                  >
                    {hub.name.toUpperCase()}
                  </text>
                  <text x={hub.svgX} y={hub.svgY + baseRadius + 12}
                    textAnchor="middle" fill="#6E7681" fontSize={7}
                    fontFamily="var(--font-mono), monospace"
                  >
                    {state.status === "operational" ? `${fmtPct(state.utilization)}` : state.status === "construction" ? "BUILDING" : "—"}
                  </text>

                  {/* Hover detail card */}
                  {isHovered && (
                    <g>
                      <rect x={hub.svgX + baseRadius + 8} y={hub.svgY - 50}
                        width={140} height={90} rx={4}
                        fill="#0D1117" stroke="rgba(0,212,255,0.4)" strokeWidth={1}
                      />
                      <text x={hub.svgX + baseRadius + 16} y={hub.svgY - 35} fill="#F0F6FC" fontSize={9} fontWeight={600} fontFamily="var(--font-mono), monospace">
                        {hub.name} · {state.zone}
                      </text>
                      <text x={hub.svgX + baseRadius + 16} y={hub.svgY - 22} fill="#6E7681" fontSize={7} fontFamily="var(--font-mono), monospace">
                        {state.status.toUpperCase()} · {fmtMT(state.capacity)} cap
                      </text>
                      <text x={hub.svgX + baseRadius + 16} y={hub.svgY - 10} fill="#00D4FF" fontSize={8} fontFamily="var(--font-mono), monospace">
                        {fmtMT(state.stored)} stored · {fmtPct(state.utilization)}
                      </text>
                      {state.commodities.map((c, ci) => (
                        <text key={c.name} x={hub.svgX + baseRadius + 16} y={hub.svgY + 4 + ci * 10}
                          fill="#C9D1D9" fontSize={7} fontFamily="var(--font-mono), monospace"
                        >
                          {c.name}: {c.mt.toLocaleString()} MT
                        </text>
                      ))}
                    </g>
                  )}
                </g>
              );
            })}

            {/* Legend */}
            <g>
              <circle cx={80} cy={425} r={4} fill="#22C55E22" stroke="#22C55E" strokeWidth={1} />
              <text x={90} y={428} fill="#6E7681" fontSize={7} fontFamily="var(--font-mono), monospace">Operational</text>
              <circle cx={145} cy={425} r={4} fill="#F59E0B22" stroke="#F59E0B" strokeWidth={1} />
              <text x={155} y={428} fill="#6E7681" fontSize={7} fontFamily="var(--font-mono), monospace">Construction</text>
              <circle cx={225} cy={425} r={4} fill="#3B404822" stroke="#3B4048" strokeWidth={1} />
              <text x={235} y={428} fill="#6E7681" fontSize={7} fontFamily="var(--font-mono), monospace">Offline</text>
              <line x1={280} y1={425} x2={300} y2={425} stroke="rgba(0,212,255,0.25)" strokeWidth={1} />
              <text x={305} y={428} fill="#6E7681" fontSize={7} fontFamily="var(--font-mono), monospace">Route</text>
            </g>
          </svg>

          {/* Phase badge overlay */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "#0D1117", border: "1px solid rgba(0,212,255,0.3)",
            borderRadius: 4, padding: "6px 10px", fontSize: 10,
          }}>
            <span style={{ color: "#6E7681" }}>PHASE </span>
            <span style={{ color: "#00D4FF", fontWeight: 700 }}>
              {sim.phase < 1 ? "PRE-OP" : sim.phase === 0.5 ? "BUILD" : sim.phase.toFixed(0)}
            </span>
            <span style={{ color: "#3B4048" }}> / 3</span>
          </div>

          {/* Total throughput overlay */}
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)",
            borderRadius: 4, padding: "6px 10px", fontSize: 10,
          }}>
            <span style={{ color: "#6E7681" }}>THROUGHPUT </span>
            <span style={{ color: "#F0F6FC", fontWeight: 600 }}>{Math.round(displayValues.throughput).toLocaleString()} MT/yr</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: FINANCIALS ────────────────────────────────────── */}
        <div style={{
          borderLeft: "1px solid rgba(48,54,61,0.5)",
          padding: "8px 10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          <div style={{ color: "#6E7681", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Financial Metrics</div>

          {/* Revenue */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ color: "#6E7681", fontSize: 9 }}>REVENUE (Annual)</span>
              <span style={{ color: sim.revenue > 0 ? "#22C55E" : "#6E7681", fontSize: 9 }}>▲</span>
            </div>
            <div style={{ color: "#F0F6FC", fontSize: 18, fontWeight: 700, marginTop: 2 }}>
              {fmtFull$(displayValues.revenue)}
            </div>
          </div>

          {/* EBITDA */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ color: "#6E7681", fontSize: 9 }}>EBITDA</div>
            <div style={{ color: "#F0F6FC", fontSize: 16, fontWeight: 600, marginTop: 2 }}>
              {fmtFull$(displayValues.ebitda)}
            </div>
          </div>

          {/* ROE */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ color: "#6E7681", fontSize: 9 }}>ROE</div>
            <div style={{ color: sim.roe > 0.1 ? "#22C55E" : "#F59E0B", fontSize: 16, fontWeight: 600, marginTop: 2 }}>
              {fmtPct(sim.roe)}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(48,54,61,0.5)" }} />

          {/* Throughput gauge */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ color: "#6E7681", fontSize: 9, marginBottom: 4 }}>THROUGHPUT</div>
            <div style={{ color: "#F0F6FC", fontSize: 13, fontWeight: 600 }}>
              {Math.round(displayValues.throughput).toLocaleString()} MT/yr
            </div>
            <div style={{ height: 6, background: "rgba(48,54,61,0.5)", borderRadius: 3, overflow: "hidden", marginTop: 4 }}>
              <div style={{
                height: "100%",
                width: `${Math.min(sim.throughputPct * 100, 100)}%`,
                background: "linear-gradient(90deg, #0EA5E9, #00D4FF)",
                borderRadius: 3,
                transition: "width 0.4s ease",
                boxShadow: "0 0 8px rgba(0,212,255,0.3)",
              }} />
            </div>
            <div style={{ color: "#6E7681", fontSize: 9, marginTop: 2 }}>{fmtPct(sim.throughputPct)} of max capacity</div>
          </div>

          {/* Export trading */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ color: "#6E7681", fontSize: 9, marginBottom: 4 }}>EXPORT TRADING</div>
            <div style={{ color: "#F0F6FC", fontSize: 13, fontWeight: 600 }}>{fmtFull$(sim.exportRevenue)}/yr</div>
            <div style={{ color: "#6E7681", fontSize: 9, marginTop: 2 }}>
              4 turns · 12% margin · {sim.exportMT.toLocaleString()} MT
            </div>
          </div>

          {/* Cumulative FCF */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ color: "#6E7681", fontSize: 9, marginBottom: 4 }}>CUMULATIVE FCF</div>
            <div style={{ color: sim.cumulativeFcf >= 0 ? "#22C55E" : "#EF4444", fontSize: 13, fontWeight: 600 }}>
              {fmtFull$(sim.cumulativeFcf)}
            </div>
            <div style={{ color: "#6E7681", fontSize: 9, marginTop: 2 }}>
              Payback: {sim.paybackYear ? `Year ${sim.paybackYear}` : "—"}
            </div>
          </div>

          {/* CapEx deployed */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ color: "#6E7681", fontSize: 9, marginBottom: 4 }}>TOTAL DEPLOYED</div>
            <div style={{ color: "#F0F6FC", fontSize: 13, fontWeight: 600 }}>
              {fmtFull$(sim.capexDeployed)} <span style={{ color: "#6E7681", fontSize: 10 }}>of {fmtFull$(sim.totalCapex)}</span>
            </div>
            <div style={{ height: 4, background: "rgba(48,54,61,0.5)", borderRadius: 2, overflow: "hidden", marginTop: 4 }}>
              <div style={{
                height: "100%",
                width: `${(sim.capexDeployed / sim.totalCapex) * 100}%`,
                background: "#C9A84C",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ color: "#6E7681", fontSize: 9, marginTop: 2 }}>{fmtPct(sim.capexDeployed / sim.totalCapex)}</div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(48,54,61,0.5)" }} />

          {/* Revenue breakdown */}
          <div style={{ background: "#0D1117", border: "1px solid rgba(48,54,61,0.5)", borderRadius: 4, padding: "8px 10px" }}>
            <div style={{ color: "#6E7681", fontSize: 9, letterSpacing: 1, marginBottom: 6 }}>REVENUE MIX</div>
            {sim.revenueBreakdown.map((rb) => (
              <div key={rb.label} style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, marginBottom: 2 }}>
                  <span style={{ color: "#C9D1D9" }}>{rb.label}</span>
                  <span style={{ color: "#6E7681" }}>{fmtPct(rb.pct)} · {fmt$(rb.amount)}</span>
                </div>
                <div style={{ height: 3, background: "rgba(48,54,61,0.5)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${rb.pct * 100}%`,
                    background: rb.label === "Export" ? "#00D4FF" : rb.label === "Storage" ? "#0EA5E9" : rb.label === "CA" ? "#22C55E" : rb.label === "WR" ? "#C9A84C" : "#6E7681",
                    borderRadius: 2,
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM: TIME SLIDER ────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(48,54,61,0.5)",
        background: "#0D1117",
        padding: "10px 16px 6px",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <span style={{ color: "#6E7681", fontSize: 9, letterSpacing: 1, whiteSpace: "nowrap" }}>TIMELINE</span>
          <span style={{ color: "#F0F6FC", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
            MONTH {month} · {monthToDate(month)}
          </span>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="range" min={0} max={120} value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              style={{
                width: "100%",
                height: 6,
                appearance: "none",
                WebkitAppearance: "none",
                background: `linear-gradient(90deg, #00D4FF ${(month / 120) * 100}%, rgba(48,54,61,0.5) ${(month / 120) * 100}%)`,
                borderRadius: 3,
                outline: "none",
                cursor: "pointer",
              }}
            />
            {/* Phase markers */}
            {[
              { m: 0, label: "FC" },
              { m: 12, label: "P1" },
              { m: 20, label: "P2" },
              { m: 30, label: "P3" },
              { m: 60, label: "Y5" },
              { m: 96, label: "Y8" },
              { m: 120, label: "Y10" },
            ].map((marker) => (
              <div key={marker.m} style={{
                position: "absolute",
                left: `${(marker.m / 120) * 100}%`,
                top: 10,
                transform: "translateX(-50%)",
                fontSize: 7,
                color: month >= marker.m ? "#00D4FF" : "#3B4048",
                whiteSpace: "nowrap",
              }}>
                {marker.label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 9, whiteSpace: "nowrap" }}>
            {[
              { label: "Phase 1", active: sim.phase >= 1 },
              { label: "Phase 2", active: sim.phase >= 2 },
              { label: "Phase 3", active: sim.phase >= 3 },
            ].map((p) => (
              <span key={p.label} style={{
                padding: "2px 6px",
                borderRadius: 3,
                border: `1px solid ${p.active ? "rgba(0,212,255,0.4)" : "rgba(48,54,61,0.5)"}`,
                color: p.active ? "#00D4FF" : "#3B4048",
                background: p.active ? "rgba(0,212,255,0.08)" : "transparent",
              }}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM TICKER ──────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(48,54,61,0.3)",
        background: "#0A0E14",
        padding: "4px 0",
        overflow: "hidden",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}>
        <div ref={tickerRef} style={{
          display: "inline-block",
          animation: "ticker-scroll 40s linear infinite",
        }}>
          {[...COMMODITIES_TICKER, ...COMMODITIES_TICKER].map((c, i) => (
            <span key={i} style={{ marginRight: 32 }}>
              <span style={{ color: "#F0F6FC", fontWeight: 600 }}>{c.name}</span>
              {" "}
              <span style={{ color: "#C9D1D9" }}>${c.price.toLocaleString()}</span>
              {" "}
              <span style={{ color: c.change >= 0 ? "#22C55E" : "#EF4444" }}>
                {c.change >= 0 ? "▲" : "▼"}{c.change >= 0 ? "+" : ""}{c.change.toFixed(1)}%
              </span>
              <span style={{ color: "#3B4048", margin: "0 12px" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── GLOBAL STYLES ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00D4FF;
          cursor: pointer;
          border: 2px solid #0A0E14;
          box-shadow: 0 0 10px rgba(0,212,255,0.6);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #00D4FF;
          cursor: pointer;
          border: 2px solid #0A0E14;
          box-shadow: 0 0 10px rgba(0,212,255,0.6);
        }
        /* Responsive */
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 240px 1fr 260px"] {
            grid-template-columns: 1fr !important;
          }
        }
        /* Scrollbar styling */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(48,54,61,0.5); border-radius: 2px; }
      `}</style>
    </div>
  );
}
