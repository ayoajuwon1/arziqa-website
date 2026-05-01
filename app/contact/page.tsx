"use client";

import { useState, type FormEvent } from "react";
import FadeIn from "@/components/FadeIn";
import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center bg-gradient-to-br from-primary via-primary-light to-primary pt-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 text-center">
          <FadeIn>
            <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
              Contact
            </h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
              Let&apos;s talk about Nigeria&apos;s commodity future.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
          {/* Form */}
          <FadeIn direction="left">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="c-name"
                    className="mb-1 block text-sm font-medium text-text-primary"
                  >
                    Name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-border bg-bg-offwhite px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c-email"
                    className="mb-1 block text-sm font-medium text-text-primary"
                  >
                    Email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-border bg-bg-offwhite px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c-org"
                    className="mb-1 block text-sm font-medium text-text-primary"
                  >
                    Organisation
                  </label>
                  <input
                    id="c-org"
                    type="text"
                    className="w-full rounded-lg border border-border bg-bg-offwhite px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="c-message"
                    className="mb-1 block text-sm font-medium text-text-primary"
                  >
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    rows={5}
                    required
                    className="w-full resize-none rounded-lg border border-border bg-bg-offwhite px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  Send message
                </button>
              </form>
            ) : (
              <div className="flex h-full items-center justify-center rounded-bento border border-border bg-white p-8 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg text-primary">&#10003;</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary">
                    Message sent
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    We&apos;ll get back to you shortly.
                  </p>
                </div>
              </div>
            )}
          </FadeIn>

          {/* Contact info */}
          <FadeIn direction="right">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-text-primary">
                  Get in touch
                </h2>
                <p className="mt-2 text-text-secondary">
                  Whether you&apos;re a commodity trader, investor, or
                  development partner, we&apos;d like to hear from you.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Email
                    </p>
                    <a
                      href="mailto:hello@arziqa.com"
                      className="text-sm text-text-secondary hover:text-accent"
                    >
                      hello@arziqa.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-accent" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Location
                    </p>
                    <p className="text-sm text-text-secondary">
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
