"use client";

import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";

interface ImageGridProps {
  view: "full" | "overview";
}

/* ── Gradient placeholders ── */
const gradients = {
  storage: "from-primary to-emerald-700",
  landscape: "from-emerald-700 to-teal-600",
  texture: "from-primary-light to-emerald-800",
  processing: "from-amber-800 to-amber-600",
  logistics: "from-gray-800 to-primary",
  panoramic: "from-amber-500 via-amber-400 to-yellow-300",
  sesame: "from-amber-200 to-amber-400",
  cocoa: "from-amber-900 to-amber-700",
  cashew: "from-yellow-600 to-yellow-400",
  rice: "from-stone-100 to-stone-300",
};

function PlaceholderCard({
  label,
  gradient,
  className = "",
  sublabel,
}: {
  label: string;
  gradient: string;
  className?: string;
  sublabel?: string;
}) {
  return (
    <div
      className={`img-block group relative overflow-hidden rounded-bento ${className}`}
    >
      <div
        className={`img-bg absolute inset-0 bg-gradient-to-br ${gradient}`}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        {sublabel && (
          <span className="mb-1 text-xs uppercase tracking-widest text-white/50">
            {sublabel}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-white md:text-xl">
          {label}
        </h3>
      </div>
    </div>
  );
}

/* ── Full View ── */
function FullView() {
  return (
    <div className="space-y-4 px-4 md:px-6">
      {/* Row 1: 3 columns */}
      <FadeIn>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <PlaceholderCard
            label="Storage"
            gradient={gradients.storage}
            className="min-h-[400px] md:col-span-1 md:min-h-[500px]"
            sublabel="WAREHOUSE INTERIOR"
          />
          <PlaceholderCard
            label="11 commodities across 6 zones"
            gradient={gradients.landscape}
            className="min-h-[240px] md:col-span-2 md:min-h-[500px]"
            sublabel="AERIAL LANDSCAPE"
          />
          <PlaceholderCard
            label="Quality First"
            gradient={gradients.texture}
            className="min-h-[400px] md:col-span-1 md:min-h-[500px]"
            sublabel="COMMODITY CLOSE-UP"
          />
        </div>
      </FadeIn>

      {/* Row 2: 2 columns */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PlaceholderCard
            label="Processing & Export"
            gradient={gradients.processing}
            className="min-h-[300px] md:col-span-2 md:min-h-[400px]"
            sublabel="PROCESSING FACILITY"
          />
          <PlaceholderCard
            label="Integrated Logistics"
            gradient={gradients.logistics}
            className="min-h-[300px] md:col-span-1 md:min-h-[400px]"
            sublabel="TRUCK FLEET"
          />
        </div>
      </FadeIn>

      {/* Row 3: Full width */}
      <FadeIn delay={0.2}>
        <PlaceholderCard
          label="Preserving Nigeria's harvest"
          gradient={gradients.panoramic}
          className="min-h-[250px] md:min-h-[350px]"
          sublabel="PANORAMIC FARMLAND"
        />
      </FadeIn>
    </div>
  );
}

/* ── Overview / Bento View ── */
function OverviewView() {
  return (
    <div className="bento-grid mx-auto max-w-7xl">
      {/* Large storage card */}
      <div className="card-tall img-block group relative overflow-hidden rounded-bento">
        <div className={`img-bg absolute inset-0 bg-gradient-to-br ${gradients.storage}`} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            WAREHOUSE INTERIOR
          </span>
          <h3 className="mt-1 font-display text-lg font-semibold text-white">
            Storage
          </h3>
        </div>
      </div>

      {/* Text specs card */}
      <div className="card-wide rounded-bento bg-bg-card p-6">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Commodity Industries
        </h4>
        <ul className="space-y-1.5 text-sm text-text-primary">
          {[
            "Sesame Seeds",
            "Cocoa Beans",
            "Cashew Nuts",
            "Hibiscus (Zobo)",
            "Shea Butter",
            "Ginger",
            "Paddy Rice",
            "Soybean",
            "Maize",
            "Sorghum",
            "Groundnut",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Landscape card */}
      <div className="img-block group relative overflow-hidden rounded-bento">
        <div className={`img-bg absolute inset-0 bg-gradient-to-br ${gradients.landscape}`} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            AERIAL LANDSCAPE
          </span>
          <h3 className="mt-1 font-display font-semibold text-white">
            6 Zones
          </h3>
        </div>
      </div>

      {/* Stat card */}
      <div className="flex flex-col items-center justify-center rounded-bento bg-primary p-6 text-center">
        <span className="font-mono text-3xl font-bold text-accent">40%</span>
        <span className="mt-1 text-xs text-white/70">
          post-harvest loss in Nigeria
        </span>
      </div>

      {/* Processing card */}
      <div className="card-wide img-block group relative overflow-hidden rounded-bento">
        <div className={`img-bg absolute inset-0 bg-gradient-to-br ${gradients.processing}`} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            PROCESSING FACILITY
          </span>
          <h3 className="mt-1 font-display text-lg font-semibold text-white">
            Processing & Export
          </h3>
        </div>
      </div>

      {/* Commodity swatches */}
      <div className="flex flex-col gap-2 rounded-bento bg-bg-card p-4">
        <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">
          Key Commodities
        </span>
        {[
          { name: "Sesame", g: gradients.sesame },
          { name: "Cocoa", g: gradients.cocoa },
          { name: "Cashew", g: gradients.cashew },
          { name: "Rice", g: gradients.rice },
        ].map((c) => (
          <div key={c.name} className="flex items-center gap-2">
            <div className={`h-6 w-10 rounded bg-gradient-to-r ${c.g}`} />
            <span className="text-xs text-text-primary">{c.name}</span>
          </div>
        ))}
      </div>

      {/* CTA card */}
      <div className="flex flex-col items-center justify-center rounded-bento bg-accent p-6 text-center">
        <span className="font-display text-lg font-semibold text-white">
          Get in Touch
        </span>
        <a
          href="/contact"
          className="mt-3 rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-accent"
        >
          Contact
        </a>
      </div>

      {/* Logistics card */}
      <div className="img-block group relative overflow-hidden rounded-bento">
        <div className={`img-bg absolute inset-0 bg-gradient-to-br ${gradients.logistics}`} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <span className="text-xs uppercase tracking-widest text-white/50">
            TRUCK FLEET
          </span>
          <h3 className="mt-1 font-display font-semibold text-white">
            Logistics
          </h3>
        </div>
      </div>

      {/* Panoramic full-width */}
      <div className="card-full img-block group relative overflow-hidden rounded-bento">
        <div className={`img-bg absolute inset-0 bg-gradient-to-r ${gradients.panoramic}`} />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex h-full flex-col justify-end p-5">
          <span className="text-xs uppercase tracking-widest text-black/40">
            PANORAMIC FARMLAND
          </span>
          <h3 className="mt-1 font-display text-lg font-semibold text-text-primary">
            Preserving Nigeria&apos;s harvest
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function ImageGrid({ view }: ImageGridProps) {
  return (
    <section id="grid" className="py-12 md:py-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {view === "full" ? <FullView /> : <OverviewView />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
