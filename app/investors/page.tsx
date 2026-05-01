"use client";

import { useState, type FormEvent } from "react";
import FadeIn from "@/components/FadeIn";

export default function InvestorsPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder -- wire up to backend
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[50vh] items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary pt-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
              Investor Access
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/70">
              For institutional investors and strategic partners.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Gate form */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-md px-6">
          <FadeIn>
            {!submitted ? (
              <div className="rounded-bento border border-border bg-white p-8">
                <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">
                  Request access
                </h2>
                <p className="mb-8 text-sm text-text-secondary">
                  Submit your details below and our team will share the investor
                  materials with you.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="inv-name"
                      className="mb-1 block text-sm font-medium text-text-primary"
                    >
                      Full name
                    </label>
                    <input
                      id="inv-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-border bg-bg-offwhite px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="inv-email"
                      className="mb-1 block text-sm font-medium text-text-primary"
                    >
                      Email address
                    </label>
                    <input
                      id="inv-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-border bg-bg-offwhite px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="inv-org"
                      className="mb-1 block text-sm font-medium text-text-primary"
                    >
                      Organisation
                    </label>
                    <input
                      id="inv-org"
                      type="text"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      className="w-full rounded-lg border border-border bg-bg-offwhite px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    Request Access
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-bento border border-border bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg text-primary">&#10003;</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Request received
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Thank you, {name}. Our team will reach out to{" "}
                  <span className="font-medium text-text-primary">{email}</span>{" "}
                  with access to investor materials.
                </p>
              </div>
            )}
          </FadeIn>
        </div>
      </section>
    </>
  );
}
