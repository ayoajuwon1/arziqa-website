"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { simulate, DEFAULT_CONFIG } from "../../components/simulation";
import type { SimulationState, SimConfig } from "../../components/simulation";
import ControlPanel from "../../components/cmd/ControlPanel";
import Overview from "../../components/cmd/Overview";
import HubPanel from "../../components/cmd/HubPanel";
import FleetPanel from "../../components/cmd/FleetPanel";
import ExportPanel from "../../components/cmd/ExportPanel";
import FinancePanel from "../../components/cmd/FinancePanel";
import PeoplePanel from "../../components/cmd/PeoplePanel";
import AlertPanel from "../../components/cmd/AlertPanel";
import MarketPanel from "../../components/cmd/MarketPanel";

const SimMap = dynamic(() => import("../../components/SimMap"), { ssr: false });

// ─── COLORS ───
const C = {
  bg: "#0A0E14",
  card: "#0D1117",
  cardHover: "#161B22",
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

const mono = "var(--font-mono, monospace)";

type Tab = "overview" | "hubs" | "fleet" | "export" | "finance" | "people" | "alerts" | "market";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "overview", icon: "\u2588\u2588", label: "Overview" },
  { id: "hubs", icon: "\u2302", label: "Hubs" },
  { id: "fleet", icon: "\u25BA", label: "Fleet" },
  { id: "export", icon: "\u2693", label: "Export" },
  { id: "finance", icon: "$", label: "Finance" },
  { id: "people", icon: "\u263A", label: "People" },
  { id: "alerts", icon: "!", label: "Alerts" },
  { id: "market", icon: "\u2191", label: "Market" },
];

export default function CommandPage() {
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [controlsOpen, setControlsOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Baseline for comparison
  const baselineState = useMemo(() => simulate({ ...DEFAULT_CONFIG, month: config.month }), [config.month]);

  // Run simulation
  const state: SimulationState = useMemo(() => simulate(config), [config]);
  const month = config.month;

  // Play/stop
  useEffect(() => {
    if (playing) {
      const ms = speed === 1 ? 3000 : speed === 5 ? 600 : 300;
      intervalRef.current = setInterval(() => {
        setConfig(c => { if (c.month >= 120) { setPlaying(false); return { ...c, month: 120 }; } return { ...c, month: c.month + 1 }; });
      }, ms);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed]);

  const handleHubClick = useCallback((id: string) => {
    setSelectedHub(id);
    setSelectedTruck(null);
    setActiveTab("hubs");
  }, []);

  const handleTruckClick = useCallback((id: number) => {
    if (id === 0) { setSelectedTruck(null); return; }
    setSelectedTruck(id);
    setSelectedHub(null);
    setActiveTab("fleet");
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    if (tab !== "hubs") setSelectedHub(null);
    if (tab !== "fleet") setSelectedTruck(null);
  }, []);

  // Alert counts
  const critCount = state.alerts.filter(a => a.severity === "critical").length;
  const warnCount = state.alerts.filter(a => a.severity === "warning").length;

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: C.bg, overflow: "hidden", fontFamily: mono }}>
      {/* ─── TOP BAR ─── */}
      <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: `1px solid ${C.border}`, background: C.card, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: "0.1em" }}>ARZIQA COMMAND</span>
          <span style={{ fontSize: 10, color: C.dim }}>|</span>
          <span style={{ fontSize: 11, color: C.text }}>{state.date}</span>
          <span style={{ fontSize: 10, color: C.dim }}>|</span>
          <span style={{ fontSize: 10, color: C.dim }}>Phase {state.phase}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {critCount > 0 && <span style={{ fontSize: 10, color: C.red, background: "rgba(239,68,68,0.15)", padding: "2px 8px", borderRadius: 3 }}>{critCount} CRIT</span>}
          {warnCount > 0 && <span style={{ fontSize: 10, color: C.amber, background: "rgba(245,158,11,0.15)", padding: "2px 8px", borderRadius: 3 }}>{warnCount} WARN</span>}
          <span style={{ fontSize: 10, color: C.dim }}>M{month}/120</span>
        </div>
      </div>

      {/* ─── MAIN BODY ─── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* LEFT NAV */}
        <div style={{ width: 72, display: "flex", flexDirection: "column", borderRight: `1px solid ${C.border}`, background: C.card, flexShrink: 0, paddingTop: 8 }}>
          {/* Controls button */}
          <button
            onClick={() => setControlsOpen(o => !o)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "10px 4px", margin: "2px 4px", border: "none", borderRadius: 6,
              background: controlsOpen ? "rgba(201,168,76,0.1)" : "transparent",
              borderLeft: controlsOpen ? `2px solid ${C.gold}` : "2px solid transparent",
              color: controlsOpen ? C.gold : C.dim,
              cursor: "pointer", fontFamily: mono, transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 16, marginBottom: 2 }}>⚙</span>
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Controls</span>
          </button>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "10px 4px", margin: "2px 4px", border: "none", borderRadius: 6,
                background: activeTab === tab.id ? "rgba(0,212,255,0.1)" : "transparent",
                borderLeft: activeTab === tab.id ? `2px solid ${C.cyan}` : "2px solid transparent",
                color: activeTab === tab.id ? C.cyan : C.dim,
                cursor: "pointer", fontFamily: mono, transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16, marginBottom: 2 }}>{tab.icon}</span>
              <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTROL PANEL */}
        {controlsOpen && (
          <ControlPanel
            config={config}
            onChange={setConfig}
            onClose={() => setControlsOpen(false)}
            baselineRevenue={baselineState.financials.revenue.total}
            baselineEbitda={baselineState.financials.ebitda}
            baselineRoe={baselineState.financials.roe}
          />
        )}

        {/* CENTER MAP */}
        <div style={{ flex: 1, position: "relative" }}>
          <SimMap
            hubs={state.hubs}
            trucks={state.trucks}
            ports={state.ports}
            selectedHub={selectedHub}
            selectedTruck={selectedTruck}
            onHubClick={handleHubClick}
            onTruckClick={handleTruckClick}
            disabledHubs={Object.entries(config.hubsEnabled).filter(([, v]) => !v).map(([k]) => k)}
          />
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 320, borderLeft: `1px solid ${C.border}`, background: C.bg, overflowY: "auto", flexShrink: 0 }}>
          {activeTab === "overview" && <Overview state={state} />}
          {activeTab === "hubs" && <HubPanel hub={selectedHub ? state.hubs.find(h => h.id === selectedHub) || null : null} hubs={state.hubs} onSelect={handleHubClick} />}
          {activeTab === "fleet" && <FleetPanel trucks={state.trucks} selectedTruck={selectedTruck} onSelect={handleTruckClick} />}
          {activeTab === "export" && <ExportPanel deals={state.exports} />}
          {activeTab === "finance" && <FinancePanel state={state} />}
          {activeTab === "people" && <PeoplePanel state={state} />}
          {activeTab === "alerts" && <AlertPanel alerts={state.alerts} />}
          {activeTab === "market" && <MarketPanel market={state.market} />}
        </div>
      </div>

      {/* ─── BOTTOM CONTROL BAR ─── */}
      <div style={{ height: 80, borderTop: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0 }}>
        {/* Play controls */}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setPlaying(!playing)} style={{ width: 36, height: 36, borderRadius: 6, border: `1px solid ${C.border}`, background: playing ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: playing ? C.red : C.green, fontFamily: mono, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {playing ? "\u25A0" : "\u25B6"}
          </button>
          <button onClick={() => { setConfig(c => ({ ...c, month: 0 })); setPlaying(false); }} style={{ width: 36, height: 36, borderRadius: 6, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", color: C.dim, fontFamily: mono, fontSize: 11, cursor: "pointer" }}>RST</button>
        </div>

        {/* Speed selector */}
        <div style={{ display: "flex", gap: 2 }}>
          {[1, 5, 10].map(s => (
            <button key={s} onClick={() => setSpeed(s)} style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid ${speed === s ? C.cyan : C.border}`, background: speed === s ? "rgba(0,212,255,0.1)" : "transparent", color: speed === s ? C.cyan : C.dim, fontFamily: mono, fontSize: 9, cursor: "pointer" }}>{s}x</button>
          ))}
        </div>

        {/* Slider */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 9, color: C.dim, fontFamily: mono, minWidth: 20 }}>0</span>
          <input
            type="range" min={0} max={120} value={month}
            onChange={e => { setConfig(c => ({ ...c, month: Number(e.target.value) })); setPlaying(false); }}
            style={{ flex: 1, accentColor: C.cyan, height: 4, cursor: "pointer" }}
          />
          <span style={{ fontSize: 9, color: C.dim, fontFamily: mono, minWidth: 24 }}>120</span>
        </div>

        {/* Phase jumps */}
        <div style={{ display: "flex", gap: 2 }}>
          {[{ label: "P1", month: 12 }, { label: "P2", month: 24 }, { label: "P3", month: 48 }, { label: "Y5", month: 60 }, { label: "Y10", month: 120 }].map(j => (
            <button key={j.label} onClick={() => { setConfig(c => ({ ...c, month: j.month })); setPlaying(false); }} style={{ padding: "4px 6px", borderRadius: 4, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", color: C.dim, fontFamily: mono, fontSize: 9, cursor: "pointer" }}>{j.label}</button>
          ))}
        </div>

        {/* Alert ticker */}
        <div style={{ width: 280, overflow: "hidden", borderLeft: `1px solid ${C.border}`, paddingLeft: 12, flexShrink: 0 }}>
          {state.alerts.length > 0 ? (
            <div style={{ fontSize: 10, fontFamily: mono, color: state.alerts[0].severity === "critical" ? C.red : state.alerts[0].severity === "warning" ? C.amber : C.cyan, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {state.alerts[state.alerts.length - 1]?.message || "No alerts"}
            </div>
          ) : (
            <div style={{ fontSize: 10, fontFamily: mono, color: C.dim }}>No alerts</div>
          )}
          {state.alerts.length > 1 && (
            <div style={{ fontSize: 9, fontFamily: mono, color: C.dim, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              +{state.alerts.length - 1} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
