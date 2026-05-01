"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ViewToggle from "./ViewToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-shadow"
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
        boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span
            className={`font-display text-xl font-bold transition-colors duration-300 ${
              scrolled ? "text-text-primary" : "text-white"
            }`}
          >
            Arziqa
          </span>
          <span className="mb-1 inline-block h-1.5 w-1.5 rounded-sm bg-accent" />
        </Link>

        {/* Center toggle */}
        <div className="hidden md:block">
          <ViewToggle />
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 lg:flex">
            {["What We Do", "Hubs", "Company", "Contact"].map((label) => {
              const href =
                label === "What We Do"
                  ? "/#capabilities"
                  : label === "Company"
                    ? "/about"
                    : `/${label.toLowerCase()}`;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-accent ${
                    scrolled ? "text-text-primary" : "text-white/90"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/investors"
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Investor Access
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
