"use client";

import {
  Warehouse,
  Thermometer,
  Settings,
  Ship,
  FileText,
  Truck,
  Snowflake,
  Monitor,
} from "lucide-react";
import FadeIn from "./FadeIn";

const capabilities = [
  { icon: Warehouse, label: "Dry Storage" },
  { icon: Thermometer, label: "Controlled Atmosphere" },
  { icon: Settings, label: "Processing" },
  { icon: Ship, label: "Export Trading" },
  { icon: FileText, label: "WR Financing" },
  { icon: Truck, label: "Logistics" },
  { icon: Snowflake, label: "Pre-Cooling" },
  { icon: Monitor, label: "Digital Platform" },
];

export default function CapabilitiesGrid() {
  return (
    <section id="capabilities" className="bg-bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <FadeIn>
          <h2 className="mb-4 text-center font-display text-3xl font-bold text-text-primary md:text-4xl">
            What we do
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-text-secondary">
            End-to-end commodity infrastructure from farm gate to export terminal.
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {capabilities.map((cap, i) => (
            <FadeIn key={cap.label} delay={i * 0.05}>
              <div className="group flex flex-col items-center gap-3 rounded-bento border border-border bg-white p-6 text-center transition-colors hover:border-accent">
                <cap.icon
                  className="h-6 w-6 text-text-secondary transition-colors group-hover:text-accent"
                  strokeWidth={1.5}
                />
                <span className="text-sm font-medium text-text-primary">
                  {cap.label}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
