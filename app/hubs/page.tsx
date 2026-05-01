"use client";

import FadeIn from "@/components/FadeIn";
import HubMap from "@/components/HubMap";

const hubs = [
  {
    name: "Kano Hub",
    zone: "North-West",
    commodities: "Sesame, Groundnut, Sorghum",
    gradient: "from-primary to-emerald-700",
  },
  {
    name: "Kaduna Hub",
    zone: "North-West",
    commodities: "Ginger, Maize, Soybean",
    gradient: "from-emerald-700 to-teal-600",
  },
  {
    name: "Abuja Hub",
    zone: "North-Central",
    commodities: "Sesame, Cashew, Soybean",
    gradient: "from-primary-light to-primary",
  },
  {
    name: "Lagos Hub",
    zone: "South-West",
    commodities: "Cocoa, Cashew, Export Processing",
    gradient: "from-amber-800 to-amber-600",
  },
  {
    name: "Oyo Hub",
    zone: "South-West",
    commodities: "Cocoa, Shea Butter, Cashew",
    gradient: "from-teal-700 to-emerald-500",
  },
  {
    name: "Benue Hub",
    zone: "North-Central",
    commodities: "Rice, Soybean, Sesame",
    gradient: "from-gray-800 to-primary",
  },
];

export default function HubsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary pt-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
              Our Hubs
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
              Strategic locations across Nigeria&apos;s commodity corridors.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn>
            <HubMap />
          </FadeIn>
        </div>
      </section>

      {/* Hub cards */}
      <section className="bg-bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hubs.map((hub, i) => (
              <FadeIn key={hub.name} delay={i * 0.08}>
                <div className="overflow-hidden rounded-bento border border-border bg-white">
                  <div
                    className={`h-36 bg-gradient-to-br ${hub.gradient}`}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs uppercase tracking-widest text-white/30">
                        HUB PHOTO
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-text-primary">
                      {hub.name}
                    </h3>
                    <p className="mt-1 text-sm text-accent">{hub.zone}</p>
                    <p className="mt-3 text-sm text-text-secondary">
                      <span className="font-medium text-text-primary">
                        Commodities:{" "}
                      </span>
                      {hub.commodities}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
