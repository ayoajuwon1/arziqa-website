"use client";

import { useState, useMemo } from "react";

// ── TYPES ──
type CustomerType = "smallholder" | "aggregator" | "corporate" | "export" | "bank" | "humanitarian";
type Commodity = "sesame" | "cashew" | "cocoa" | "soybeans" | "rice" | "maize" | "sorghum" | "beans" | "groundnuts";

interface SimState {
  customer: CustomerType;
  commodity: Commodity;
  tonnes: number;
  monthsStored: number;
  utilization: number;
  exportMargin: number;
  exportTurns: number;
  wrSpread: number;
  storageFee: number;
  processingFee: number;
}

// ── COMMODITY DATA ──
const COMMODITIES: Record<Commodity, { name: string; harvestPrice: number; leanPrice: number; spread: number; exportFob: number; moisture: string; aflatoxinRisk: string; hubs: string }> = {
  sesame:     { name: "Sesame",     harvestPrice: 1200, leanPrice: 1850, spread: 54, exportFob: 1850, moisture: "<8%",    aflatoxinRisk: "Medium", hubs: "Kano, Makurdi, Gombe" },
  cashew:     { name: "Cashew",     harvestPrice: 800,  leanPrice: 1050, spread: 31, exportFob: 1050, moisture: "<9%",    aflatoxinRisk: "Low",    hubs: "Calabar, Ibadan" },
  cocoa:      { name: "Cocoa",      harvestPrice: 3200, leanPrice: 3800, spread: 19, exportFob: 3800, moisture: "<7%",    aflatoxinRisk: "High",   hubs: "Ibadan, Calabar" },
  soybeans:   { name: "Soybeans",   harvestPrice: 350,  leanPrice: 490,  spread: 40, exportFob: 490,  moisture: "<12%",   aflatoxinRisk: "Medium", hubs: "Makurdi" },
  rice:       { name: "Rice Paddy", harvestPrice: 280,  leanPrice: 378,  spread: 35, exportFob: 378,  moisture: "<13%",   aflatoxinRisk: "Medium", hubs: "Kano, Makurdi, Abakaliki" },
  maize:      { name: "Maize",      harvestPrice: 220,  leanPrice: 337,  spread: 53, exportFob: 337,  moisture: "<13.5%", aflatoxinRisk: "High",   hubs: "Kano, Ibadan, Makurdi" },
  sorghum:    { name: "Sorghum",    harvestPrice: 200,  leanPrice: 314,  spread: 57, exportFob: 314,  moisture: "<12%",   aflatoxinRisk: "Low",    hubs: "Kano, Gombe" },
  beans:      { name: "Cowpea",     harvestPrice: 350,  leanPrice: 637,  spread: 82, exportFob: 637,  moisture: "<12%",   aflatoxinRisk: "Low",    hubs: "Kano, Gombe" },
  groundnuts: { name: "Groundnuts", harvestPrice: 400,  leanPrice: 560,  spread: 40, exportFob: 560,  moisture: "<9%",    aflatoxinRisk: "Very High", hubs: "Kano" },
};

const CUSTOMERS: Record<CustomerType, { name: string; icon: string; desc: string }> = {
  smallholder:  { name: "Smallholder Farmer", icon: "🌾", desc: "Stores harvest, gets WR financing, sells at lean season" },
  aggregator:   { name: "Aggregator/Trader",  icon: "🚛", desc: "Consolidates from farmers, stores in bulk, sells to corporates" },
  corporate:    { name: "Corporate Processor", icon: "🏭", desc: "BUA, Olam, Nestle — reserves dedicated storage + processing" },
  export:       { name: "Export Buyer",        icon: "🚢", desc: "Japanese/EU buyer wants FOB — Arziqa cleans, grades, ships" },
  bank:         { name: "Bank (WR Financing)", icon: "🏦", desc: "Sterling/Stanbic lends against receipts, Arziqa is CMA" },
  humanitarian: { name: "WFP/Humanitarian",    icon: "🏥", desc: "Leases storage for emergency food pre-positioning" },
};

// ── PROCESS STEPS ──
function getProcessSteps(customer: CustomerType) {
  const base = [
    { id: "arrival", label: "Arrival", desc: "Commodity arrives at hub (own transport or Arziqa fleet)", icon: "📦", active: true },
    { id: "weigh", label: "Weighbridge", desc: "Truck weighed, tonnage recorded on Brikstack", icon: "⚖️", active: true },
    { id: "sample", label: "Sampling", desc: "QA officer takes samples from each bag", icon: "🧪", active: true },
    { id: "lab", label: "Lab Testing", desc: "Moisture, aflatoxin (15-min rapid test), visual grading", icon: "🔬", active: true },
  ];
  const cleaning = { id: "clean", label: "Cleaning & Grading", desc: "Destoner → Sieve → Aspirator → Gravity separator → Colour sorter", icon: "✨", active: true };
  const storage = { id: "store", label: "Certified Storage", desc: "Sealed, ventilated, pest-controlled, moisture-monitored", icon: "🏗️", active: true };
  const receipt = { id: "receipt", label: "WR Issued", desc: "Digital warehouse receipt via Brikstack under ISA 2025", icon: "📄", active: true };
  const finance = { id: "finance", label: "Bank Financing", desc: "Receipt → bank → 60-70% advance → cash NOW", icon: "💰", active: true };
  const sell = { id: "sell", label: "Sell / Release", desc: "Lean season sale at premium OR export FOB", icon: "💵", active: true };
  const exportSteps = [
    { id: "container", label: "Containerisation", desc: "Loaded into 20ft containers (25 MT each), sealed", icon: "📦", active: true },
    { id: "transport", label: "Hub → Port", desc: "Arziqa fleet or third-party haulier to Apapa/Calabar", icon: "🚛", active: true },
    { id: "port", label: "Port Clearance", desc: "NAFDAC, phytosanitary, customs, SON — loaded onto vessel", icon: "⚓", active: true },
    { id: "ship", label: "Vessel Departs", desc: "FOB — buyer pays freight. Letter of Credit settles.", icon: "🚢", active: true },
  ];
  const coldStep = { id: "cold", label: "Pre-Cooling", desc: "Rapid cooling → transfer to NSIA cold chain", icon: "❄️", active: true };

  switch (customer) {
    case "smallholder": return [...base, cleaning, storage, receipt, finance, sell];
    case "aggregator": return [...base, cleaning, storage, receipt, finance, sell];
    case "corporate": return [...base, cleaning, storage, { ...sell, label: "Corporate Draw-Down", desc: "BUA/Olam sends trucks weekly — Arziqa loads to spec" }];
    case "export": return [...base, cleaning, storage, ...exportSteps];
    case "bank": return [storage, receipt, finance, { id: "monitor", label: "CMA Monitoring", desc: "Monthly stock reports, insurance verification, release control", icon: "📊", active: true }];
    case "humanitarian": return [{ ...base[0], desc: "WFP trucks deliver from procurement centres" }, base[1], storage, { id: "dispatch", label: "Emergency Dispatch", desc: "WFP draws down for Borno/Yobe/Adamawa distribution", icon: "🏥", active: true }];
  }
}

// ── FINANCIAL CALCULATIONS ──
function calcFinancials(s: SimState) {
  const comm = COMMODITIES[s.commodity];
  const totalCapex = 173_400_000;
  const annualOpex = 4_079_272;

  // Per-customer revenue
  const storageCost = s.tonnes * s.storageFee * s.monthsStored;
  const processingCost = s.tonnes * s.processingFee;
  const priceGain = s.tonnes * (comm.leanPrice - comm.harvestPrice);
  const storageAsPercentOfGain = priceGain > 0 ? (storageCost / priceGain) * 100 : 0;
  const farmerNetBenefit = priceGain - storageCost - processingCost;
  const wrAdvance = s.tonnes * comm.harvestPrice * 0.65;
  const wrInterest = wrAdvance * 0.25 * (s.monthsStored / 12);

  // Platform-level annuals
  const totalCapacity = 80000;
  const avgStock = totalCapacity * (s.utilization / 100);
  const throughput = avgStock * 2.5;

  const revStorage = avgStock * s.storageFee * 12;
  const revCA = totalCapacity * 0.25 * (s.utilization / 100) * 15 * 12;
  const revProcessing = throughput * s.processingFee;
  const revExport = 25_000_000 * s.exportTurns * (s.exportMargin / 100);
  const revWR = 15_000_000 * 1.5 * (s.wrSpread / 100);
  const revFacilitation = throughput * 0.25 * 25;
  const revLogistics = throughput * 0.30 * 25;
  const revInsurance = throughput * 300 * 0.005;
  const revPreCool = throughput * 0.10 * 8;
  const revCMA = avgStock * 0.30 * 300 * 0.01;

  const totalRevenue = revStorage + revCA + revProcessing + revExport + revWR + revFacilitation + revLogistics + revInsurance + revPreCool + revCMA;
  const ebitda = totalRevenue - annualOpex;
  const roe = (ebitda / totalCapex) * 100;
  const paybackYears = ebitda > 0 ? totalCapex / ebitda : 99;
  const terminalValue10x = ebitda * 10;
  const moneyMultiple = (ebitda * 10 + ebitda * 7) / totalCapex; // rough approximation

  return {
    // Customer-level
    storageCost, processingCost, priceGain, storageAsPercentOfGain, farmerNetBenefit, wrAdvance, wrInterest,
    // Platform-level
    revStorage, revCA, revProcessing, revExport, revWR, revFacilitation, revLogistics, revInsurance, revPreCool, revCMA,
    totalRevenue, ebitda, roe, paybackYears, terminalValue10x, moneyMultiple,
    annualOpex, throughput, avgStock,
    // Revenue shares
    shares: [
      { name: "Export Trading", value: revExport, color: "#C9A84C" },
      { name: "Dry Storage", value: revStorage, color: "#1B4332" },
      { name: "CA Storage", value: revCA, color: "#2D6A4F" },
      { name: "WR Finance", value: revWR, color: "#40916C" },
      { name: "Processing", value: revProcessing, color: "#52B788" },
      { name: "Logistics", value: revLogistics, color: "#74C69D" },
      { name: "Facilitation", value: revFacilitation, color: "#95D5B2" },
      { name: "Insurance", value: revInsurance, color: "#B7E4C7" },
      { name: "Pre-Cooling", value: revPreCool, color: "#D8F3DC" },
      { name: "CMA", value: revCMA, color: "#E8F5E9" },
    ]
  };
}

// ── FORMAT HELPERS ──
const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n.toFixed(0)}`;
const fmtN = (n: number) => `₦${(n * 1500).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

// ── MAIN COMPONENT ──
export default function SimulatorPage() {
  const [state, setState] = useState<SimState>({
    customer: "smallholder",
    commodity: "sesame",
    tonnes: 14,
    monthsStored: 5,
    utilization: 70,
    exportMargin: 12,
    exportTurns: 4,
    wrSpread: 15,
    storageFee: 7,
    processingFee: 10,
  });

  const set = <K extends keyof SimState>(key: K, val: SimState[K]) => setState(s => ({ ...s, [key]: val }));
  const fin = useMemo(() => calcFinancials(state), [state]);
  const comm = COMMODITIES[state.commodity];
  const steps = getProcessSteps(state.customer);

  return (
    <div style={{ background: "#0F0D09", color: "#F2EADB", minHeight: "100vh", fontFamily: "'Inter Tight', system-ui, sans-serif" }}>
      {/* HEADER */}
      <div style={{ padding: "24px 48px", borderBottom: "1px solid rgba(184,146,74,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontStyle: "italic" }}>Arziqa</span>
          <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginLeft: 16, color: "#C9A84C", fontFamily: "monospace" }}>Platform Simulator</span>
        </div>
        <a href="/" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(242,234,219,0.5)", fontFamily: "monospace" }}>← Back to site</a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 73px)" }}>
        {/* LEFT PANEL — CONTROLS */}
        <div style={{ padding: "32px 24px", borderRight: "1px solid rgba(184,146,74,0.12)", overflowY: "auto" as const, maxHeight: "calc(100vh - 73px)" }}>
          {/* Customer selector */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "monospace", display: "block", marginBottom: 12 }}>Customer Type</label>
            {(Object.keys(CUSTOMERS) as CustomerType[]).map(k => (
              <button key={k} onClick={() => set("customer", k)}
                style={{
                  display: "block", width: "100%", textAlign: "left" as const, padding: "10px 14px", marginBottom: 4,
                  background: state.customer === k ? "rgba(184,146,74,0.12)" : "transparent",
                  border: state.customer === k ? "1px solid rgba(184,146,74,0.3)" : "1px solid transparent",
                  borderRadius: 8, color: "#F2EADB", cursor: "pointer", fontSize: 13, transition: "all 0.2s",
                }}>
                <span style={{ marginRight: 8 }}>{CUSTOMERS[k].icon}</span>
                {CUSTOMERS[k].name}
              </button>
            ))}
          </div>

          {/* Commodity selector */}
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "monospace", display: "block", marginBottom: 12 }}>Commodity</label>
            <select value={state.commodity} onChange={e => set("commodity", e.target.value as Commodity)}
              style={{ width: "100%", padding: "10px 14px", background: "#1A140E", color: "#F2EADB", border: "1px solid rgba(184,146,74,0.2)", borderRadius: 8, fontSize: 14 }}>
              {(Object.keys(COMMODITIES) as Commodity[]).map(k => (
                <option key={k} value={k}>{COMMODITIES[k].name}</option>
              ))}
            </select>
          </div>

          {/* Sliders */}
          {[
            { key: "tonnes" as const, label: "Tonnes Deposited", min: 1, max: 500, step: 1, unit: "MT" },
            { key: "monthsStored" as const, label: "Months Stored", min: 1, max: 12, step: 1, unit: "months" },
            { key: "utilization" as const, label: "Hub Utilization", min: 20, max: 95, step: 5, unit: "%" },
            { key: "exportMargin" as const, label: "Export Net Margin", min: 4, max: 20, step: 1, unit: "%" },
            { key: "exportTurns" as const, label: "Export Turns / Year", min: 1, max: 6, step: 1, unit: "turns" },
            { key: "storageFee" as const, label: "Storage Fee", min: 3, max: 15, step: 1, unit: "$/t/mo" },
          ].map(({ key, label, min, max, step, unit }) => (
            <div key={key} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 11, color: "rgba(242,234,219,0.7)", fontFamily: "monospace" }}>{label}</label>
                <span style={{ fontSize: 14, color: "#C9A84C", fontWeight: 600 }}>{state[key]} {unit}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={state[key]}
                onChange={e => set(key, Number(e.target.value))}
                style={{ width: "100%", accentColor: "#C9A84C" }} />
            </div>
          ))}
        </div>

        {/* RIGHT PANEL — DASHBOARD */}
        <div style={{ padding: "32px 40px", overflowY: "auto" as const, maxHeight: "calc(100vh - 73px)" }}>
          {/* Customer Description */}
          <div style={{ marginBottom: 32, padding: "20px 24px", background: "rgba(184,146,74,0.06)", border: "1px solid rgba(184,146,74,0.15)", borderRadius: 12 }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>
              <span style={{ marginRight: 10 }}>{CUSTOMERS[state.customer].icon}</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>{CUSTOMERS[state.customer].name}</span>
              <span style={{ fontSize: 13, color: "rgba(242,234,219,0.5)", marginLeft: 12 }}>storing {state.tonnes} MT of {comm.name}</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(242,234,219,0.6)" }}>{CUSTOMERS[state.customer].desc}</div>
          </div>

          {/* Commodity Quick Facts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Harvest Price", value: `$${comm.harvestPrice}/MT` },
              { label: "Lean Season", value: `$${comm.leanPrice}/MT` },
              { label: "Spread", value: `+${comm.spread}%` },
              { label: "Moisture Req.", value: comm.moisture },
            ].map((item, i) => (
              <div key={i} style={{ padding: "16px 14px", background: "#1A140E", border: "1px solid rgba(184,146,74,0.1)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(242,234,219,0.5)", fontFamily: "monospace", marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 22, fontFamily: "'Playfair Display', serif", color: "#C9A84C" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* PROCESS FLOW */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "monospace", marginBottom: 16 }}>Process Flow — {CUSTOMERS[state.customer].name}</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
              {steps?.map((step, i) => (
                <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    padding: "14px 16px", background: "rgba(184,146,74,0.08)", border: "1px solid rgba(184,146,74,0.2)",
                    borderRadius: 10, minWidth: 100, textAlign: "center" as const, transition: "all 0.3s",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{step.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{step.label}</div>
                    <div style={{ fontSize: 9, color: "rgba(242,234,219,0.5)", lineHeight: 1.3 }}>{step.desc}</div>
                  </div>
                  {i < (steps?.length || 0) - 1 && <div style={{ color: "#C9A84C", margin: "0 4px", fontSize: 16 }}>→</div>}
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMER-LEVEL ECONOMICS */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "monospace", marginBottom: 16 }}>Customer Economics — {state.tonnes} MT × {state.monthsStored} months</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Storage Cost", value: fmt(fin.storageCost), sub: fmtN(fin.storageCost) },
                { label: "Processing Cost", value: fmt(fin.processingCost), sub: fmtN(fin.processingCost) },
                { label: "Price Appreciation", value: fmt(fin.priceGain), sub: `+${comm.spread}% seasonal` },
                { label: "Net Benefit to Customer", value: fmt(fin.farmerNetBenefit), sub: fin.farmerNetBenefit > 0 ? "✓ Profitable" : "✗ Loss" },
                { label: "Storage as % of Gain", value: pct(fin.storageAsPercentOfGain), sub: fin.storageAsPercentOfGain < 10 ? "Highly affordable" : "Check rate" },
                { label: "WR Advance (65%)", value: fmt(fin.wrAdvance), sub: fmtN(fin.wrAdvance) },
              ].map((item, i) => (
                <div key={i} style={{ padding: "16px", background: "#1A140E", border: "1px solid rgba(184,146,74,0.1)", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(242,234,219,0.5)", fontFamily: "monospace", marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", color: item.label.includes("Net Benefit") && fin.farmerNetBenefit > 0 ? "#52B788" : "#C9A84C" }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(242,234,219,0.4)", marginTop: 4 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PLATFORM-LEVEL FINANCIALS */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "monospace", marginBottom: 16 }}>Platform Financials — 80,000 MT at {state.utilization}% Utilization</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Annual Revenue", value: fmt(fin.totalRevenue) },
                { label: "EBITDA", value: fmt(fin.ebitda) },
                { label: "ROE", value: pct(fin.roe) },
                { label: "Payback", value: fin.paybackYears < 15 ? `Year ${Math.ceil(fin.paybackYears)}` : ">15yr" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "20px", background: fin.roe > 10 ? "rgba(27,67,50,0.3)" : "rgba(122,42,31,0.15)", border: `1px solid ${fin.roe > 10 ? "rgba(82,183,136,0.2)" : "rgba(122,42,31,0.3)"}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(242,234,219,0.6)", fontFamily: "monospace", marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", color: fin.roe > 10 ? "#52B788" : "#C9A84C" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Revenue Breakdown Bar */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 32 }}>
                {fin.shares.filter(s => s.value > 0).map((s, i) => (
                  <div key={i} style={{ flex: s.value / fin.totalRevenue, background: s.color, position: "relative" as const, minWidth: s.value / fin.totalRevenue > 0.06 ? "auto" : 0 }}
                    title={`${s.name}: ${fmt(s.value)} (${((s.value / fin.totalRevenue) * 100).toFixed(0)}%)`} />
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px 16px", marginTop: 8 }}>
                {fin.shares.filter(s => s.value > 0 && s.value / fin.totalRevenue > 0.03).map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "monospace", color: "rgba(242,234,219,0.6)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                    {s.name} {((s.value / fin.totalRevenue) * 100).toFixed(0)}%
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KEY METRICS TABLE */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#C9A84C", fontFamily: "monospace", marginBottom: 16 }}>Detailed Breakdown</div>
            <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
              <tbody>
                {[
                  ["Total Investment", "$173,400,000", "Catalytic equity"],
                  ["Hub Capacity", "80,000 MT", "6 hubs across 6 zones"],
                  ["Avg Stock", `${fin.avgStock.toLocaleString()} MT`, `${state.utilization}% utilization`],
                  ["Annual Throughput", `${fin.throughput.toLocaleString()} MT`, "2.5 turns/year"],
                  ["", "", ""],
                  ["Storage Revenue (Dry)", fmt(fin.revStorage), `${fin.avgStock.toLocaleString()} MT × $${state.storageFee}/t × 12mo`],
                  ["Storage Revenue (CA)", fmt(fin.revCA), "25% of capacity × $15/t × 12mo"],
                  ["Processing Revenue", fmt(fin.revProcessing), `${fin.throughput.toLocaleString()} MT × $${state.processingFee}/t`],
                  ["Export Trading", fmt(fin.revExport), `$25M × ${state.exportTurns} turns × ${state.exportMargin}%`],
                  ["WR Finance Spread", fmt(fin.revWR), `$15M × 1.5 cycles × ${state.wrSpread}%`],
                  ["Logistics", fmt(fin.revLogistics), "30% of throughput × $25/t"],
                  ["Facilitation", fmt(fin.revFacilitation), "25% of throughput × $25/t"],
                  ["Insurance", fmt(fin.revInsurance), "0.5% of commodity value"],
                  ["Pre-Cooling", fmt(fin.revPreCool), "10% of throughput × $8/t"],
                  ["CMA Fees", fmt(fin.revCMA), "1% of externally financed stock"],
                  ["", "", ""],
                  ["TOTAL REVENUE", fmt(fin.totalRevenue), ""],
                  ["Total OpEx", `-${fmt(fin.annualOpex)}`, "155 staff + non-salary"],
                  ["EBITDA", fmt(fin.ebitda), `${((fin.ebitda / fin.totalRevenue) * 100).toFixed(0)}% margin`],
                  ["ROE", pct(fin.roe), fin.roe > 10.5 ? "✓ Exceeds NSIA portfolio (10.5%)" : "Below NSIA portfolio"],
                  ["Terminal Value (10x)", fmt(fin.terminalValue10x), "At 10× EBITDA exit"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: row[0] === "" ? "1px solid rgba(184,146,74,0.15)" : "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "8px 0", fontWeight: ["TOTAL", "EBITDA", "ROE"].some(s => row[0].startsWith(s)) ? 700 : 400, color: row[0].startsWith("TOTAL") || row[0] === "EBITDA" ? "#C9A84C" : "inherit" }}>{row[0]}</td>
                    <td style={{ padding: "8px 0", textAlign: "right" as const, fontFamily: "monospace", color: row[1].startsWith("-") ? "#7A2A1F" : "#C9A84C", fontWeight: ["TOTAL", "EBITDA"].some(s => row[0].startsWith(s)) ? 700 : 400 }}>{row[1]}</td>
                    <td style={{ padding: "8px 0 8px 16px", fontSize: 11, color: "rgba(242,234,219,0.4)" }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BANKABILITY VERDICT */}
          <div style={{
            padding: "24px", borderRadius: 12, textAlign: "center" as const,
            background: fin.roe > 10 ? "rgba(27,67,50,0.3)" : "rgba(122,42,31,0.15)",
            border: `1px solid ${fin.roe > 10 ? "rgba(82,183,136,0.3)" : "rgba(122,42,31,0.3)"}`,
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: fin.roe > 10 ? "#52B788" : "#7A2A1F", fontFamily: "monospace", marginBottom: 8 }}>Bankability Verdict</div>
            <div style={{ fontSize: 32, fontFamily: "'Playfair Display', serif", color: fin.roe > 10 ? "#52B788" : "#7A2A1F" }}>
              {fin.roe > 12 ? "BANKABLE" : fin.roe > 10 ? "MARGINALLY BANKABLE" : fin.roe > 5 ? "BELOW THRESHOLD" : "NOT VIABLE"}
            </div>
            <div style={{ fontSize: 12, color: "rgba(242,234,219,0.5)", marginTop: 8 }}>
              ROE {pct(fin.roe)} {fin.roe > 10.5 ? "exceeds" : "below"} NSIA portfolio benchmark (10.5%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
