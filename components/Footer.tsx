"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

const navLinks = [
  { label: "What We Do", href: "/#capabilities" },
  { label: "Hubs", href: "/hubs" },
  { label: "About", href: "/about" },
  { label: "Investors", href: "/investors" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display text-xl font-bold">Arziqa</span>
              <span className="mb-1 inline-block h-1.5 w-1.5 rounded-sm bg-accent" />
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Commodity infrastructure for Nigeria. Storage, processing, and
              export services to reduce post-harvest losses and connect farmers
              to markets.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              Contact
            </h4>
            <address className="space-y-2 text-sm not-italic text-white/70">
              <p>Lagos, Nigeria</p>
              <p>
                <a
                  href="mailto:hello@arziqa.com"
                  className="transition-colors hover:text-accent"
                >
                  hello@arziqa.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <div className="flex gap-6 text-xs text-white/40">
            <span>&copy; {new Date().getFullYear()} Arziqa. All rights reserved.</span>
            <Link href="#" className="hover:text-white/70">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white/70">
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* LinkedIn icon */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-colors hover:text-accent"
              aria-label="LinkedIn"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              className="rounded-full border border-white/20 p-2 text-white/40 transition-colors hover:border-accent hover:text-accent"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
