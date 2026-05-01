"use client";

import Counter from "./Counter";
import FadeIn from "./FadeIn";

const stats = [
  { target: 3.5, prefix: "\u20A6", suffix: "T+", label: "Annual post-harvest losses", decimals: 1 },
  { target: 76, prefix: "", suffix: "%", label: "Exports rejected by the EU", decimals: 0 },
  { target: 40, prefix: "", suffix: "\u201382%", label: "Price spread lost to distress selling", decimals: 0 },
];

export default function StatsSection() {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <FadeIn>
          <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <Counter
                  target={s.target}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                />
                <span className="mt-3 text-sm text-white/70">{s.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="mx-auto mt-16 max-w-2xl text-center font-display text-lg italic text-white/60 md:text-xl">
            &ldquo;Nigeria loses more food to poor infrastructure than it
            imports. We&rsquo;re building the system to change that.&rdquo;
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
