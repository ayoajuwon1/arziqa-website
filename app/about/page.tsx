"use client";

import FadeIn from "@/components/FadeIn";

const team = [
  {
    name: "Ayodeji Ajuwon",
    role: "Co-Founder & CEO",
    bio: "MBA Columbia Business School. Background in real estate technology and infrastructure development.",
  },
  {
    name: "Victor",
    role: "Co-Founder & COO",
    bio: "Operations and logistics specialist with deep experience across Nigerian commodity markets.",
  },
];

const advisors = [
  {
    name: "Arikawe",
    role: "Advisory Board",
    focus: "Finance & Capital Markets",
  },
  {
    name: "Adeosun",
    role: "Advisory Board",
    focus: "Policy & Government Relations",
  },
  {
    name: "Erhie",
    role: "Advisory Board",
    focus: "Agriculture & Supply Chain",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative flex min-h-[50vh] items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary pt-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
              About Arziqa
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
              Building the backbone of Nigeria&apos;s commodity economy.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
              Our story
            </h2>
            <div className="mt-6 space-y-4 text-text-secondary">
              <p>
                Nigeria is Africa&apos;s largest agricultural economy, yet up to
                40% of harvested crops are lost before they reach the market.
                The cause is not a lack of production -- it&apos;s a lack of
                infrastructure.
              </p>
              <p>
                Arziqa was founded to close this gap. We are building a network
                of commodity storage hubs, processing centres, and integrated
                logistics that connect farm gates to export terminals. Our model
                is designed to reduce losses, increase commodity quality, and
                unlock better prices for every participant in the value chain.
              </p>
              <p>
                The name &ldquo;Arziqa&rdquo; comes from the Hausa word for
                prosperity. It reflects our belief that preserving Nigeria&apos;s
                harvest is the most direct path to shared economic growth.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Team */}
      <section className="bg-bg-offwhite py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-text-primary md:text-4xl">
              Leadership
            </h2>
          </FadeIn>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
            {team.map((person, i) => (
              <FadeIn key={person.name} delay={i * 0.1}>
                <div className="rounded-bento border border-border bg-white p-8">
                  {/* Avatar placeholder */}
                  <div className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-primary-light to-primary" />
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {person.name}
                  </h3>
                  <p className="text-sm text-accent">{person.role}</p>
                  <p className="mt-3 text-sm text-text-secondary">
                    {person.bio}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory board */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-text-primary md:text-4xl">
              Advisory Board
            </h2>
          </FadeIn>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {advisors.map((person, i) => (
              <FadeIn key={person.name} delay={i * 0.1}>
                <div className="rounded-bento border border-border bg-white p-6 text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-accent to-accent-hover" />
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {person.name}
                  </h3>
                  <p className="text-sm text-accent">{person.role}</p>
                  <p className="mt-2 text-xs text-text-secondary">
                    {person.focus}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Track record */}
      <section className="bg-primary py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Track record
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Our founding team has collectively built and scaled ventures across
              real estate, agricultural technology, and infrastructure in Nigeria
              and the United States. We bring operational discipline, deep
              market knowledge, and a commitment to building institutions that
              last.
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
