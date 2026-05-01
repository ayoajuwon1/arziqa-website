"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

interface CounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

export default function Counter({
  target,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setDisplay(v.toFixed(decimals));
      },
    });
    return () => controls.stop();
  }, [inView, target, duration, decimals, motionValue]);

  return (
    <span ref={ref} className="font-mono text-4xl font-bold text-accent md:text-5xl">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
