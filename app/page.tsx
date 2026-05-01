"use client";

import Hero from "@/components/Hero";
import ImageGrid from "@/components/ImageGrid";
import CapabilitiesGrid from "@/components/CapabilitiesGrid";
import StatsSection from "@/components/StatsSection";
import NewsCards from "@/components/NewsCards";
import FadeIn from "@/components/FadeIn";
import { useView } from "@/components/ViewContext";
import Link from "next/link";

export default function Home() {
  const { view } = useView();

  return (
    <>
      <Hero />

      {/* Statement */}
      <section className="bg-bg-offwhite py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold leading-tight text-text-primary md:text-5xl">
              Preserving{" "}
              <span className="text-accent">prosperity.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
              Nigeria loses up to 40% of its agricultural output to poor storage
              and fragmented supply chains. Arziqa builds the infrastructure to
              capture that value -- for farmers, traders, and the nation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Image Grid */}
      <ImageGrid view={view} />

      {/* Capabilities */}
      <CapabilitiesGrid />

      {/* Stats */}
      <StatsSection />

      {/* Two-column: text + placeholder image */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
          <FadeIn direction="left">
            <div>
              <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
                From farm gate to export terminal
              </h2>
              <p className="mt-4 text-text-secondary">
                Our integrated model connects storage hubs, processing centres,
                and logistics networks into a single, efficient chain. Commodity
                owners get better prices. Buyers get reliable supply. Nigeria
                gets a stronger export sector.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Learn more <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="aspect-[4/3] rounded-bento bg-gradient-to-br from-primary-light to-primary">
              <div className="flex h-full items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-white/30">
                  SUPPLY CHAIN VISUAL
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* News */}
      <NewsCards />

      {/* CTA */}
      <section className="bg-primary py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Build with us
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Whether you&apos;re a commodity trader, institutional investor, or
              development partner, there&apos;s a place for you in Nigeria&apos;s
              commodity future.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Get in touch
              </Link>
              <Link
                href="/investors"
                className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Investor Access
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
