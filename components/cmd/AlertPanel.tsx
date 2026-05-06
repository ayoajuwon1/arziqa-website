"use client";

import type { Alert } from "../simulation";

const C = { card: "#0D1117", border: "rgba(48,54,61,0.5)", text: "#C9D1D9", dim: "#6E7681", bright: "#F0F6FC", green: "#22C55E", amber: "#F59E0B", red: "#EF4444", cyan: "#00D4FF" };
const mono = "var(--font-mono, monospace)";

const severityConfig = {
  critical: { color: C.red, bg: "rgba(239,68,68,0.08)", label: "CRIT" },
  warning: { color: C.amber, bg: "rgba(245,158,11,0.08)", label: "WARN" },
  info: { color: C.cyan, bg: "rgba(0,212,255,0.08)", label: "INFO" },
};

export default function AlertPanel({ alerts }: { alerts: Alert[] }) {
  const sorted = [...alerts].reverse(); // most recent first

  const critCount = alerts.filter(a => a.severity === "critical").length;
  const warnCount = alerts.filter(a => a.severity === "warning").length;
  const infoCount = alerts.filter(a => a.severity === "info").length;

  return (
    <div style={{ padding: 8, overflowY: "auto", maxHeight: "100%" }}>
      <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.15em", fontFamily: mono, marginBottom: 8 }}>Alerts ({alerts.length})</div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, background: "rgba(239,68,68,0.08)", border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 4, padding: 6, textAlign: "center" }}>
          <div style={{ fontSize: 16, color: C.red, fontFamily: mono, fontWeight: 600 }}>{critCount}</div>
          <div style={{ fontSize: 8, color: C.red, fontFamily: mono }}>CRITICAL</div>
        </div>
        <div style={{ flex: 1, background: "rgba(245,158,11,0.08)", border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 4, padding: 6, textAlign: "center" }}>
          <div style={{ fontSize: 16, color: C.amber, fontFamily: mono, fontWeight: 600 }}>{warnCount}</div>
          <div style={{ fontSize: 8, color: C.amber, fontFamily: mono }}>WARNING</div>
        </div>
        <div style={{ flex: 1, background: "rgba(0,212,255,0.08)", border: `1px solid rgba(0,212,255,0.3)`, borderRadius: 4, padding: 6, textAlign: "center" }}>
          <div style={{ fontSize: 16, color: C.cyan, fontFamily: mono, fontWeight: 600 }}>{infoCount}</div>
          <div style={{ fontSize: 8, color: C.cyan, fontFamily: mono }}>INFO</div>
        </div>
      </div>

      {/* Alert list */}
      {sorted.map(alert => {
        const cfg = severityConfig[alert.severity];
        return (
          <div key={alert.id} style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, borderLeft: `3px solid ${cfg.color}`, borderRadius: 4, padding: 8, marginBottom: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 8, color: cfg.color, fontFamily: mono, fontWeight: 600 }}>{cfg.label}</span>
              <span style={{ fontSize: 8, color: C.dim, fontFamily: mono }}>{alert.timestamp}</span>
            </div>
            <div style={{ fontSize: 11, color: C.bright, fontFamily: mono, marginTop: 3 }}>{alert.message}</div>
            {alert.hub && <div style={{ fontSize: 9, color: C.dim, fontFamily: mono, marginTop: 2 }}>Hub: {alert.hub}</div>}
          </div>
        );
      })}

      {sorted.length === 0 && (
        <div style={{ textAlign: "center", color: C.dim, fontFamily: mono, fontSize: 11, padding: 20 }}>No alerts this month</div>
      )}
    </div>
  );
}
