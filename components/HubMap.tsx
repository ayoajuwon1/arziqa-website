"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const hubs = [
  { name: "Kano", x: 52, y: 18 },
  { name: "Kaduna", x: 46, y: 26 },
  { name: "Abuja", x: 45, y: 38 },
  { name: "Lagos", x: 22, y: 55 },
  { name: "Oyo", x: 28, y: 48 },
  { name: "Benue", x: 55, y: 45 },
];

export default function HubMap() {
  return (
    <Link href="/hubs" className="group block">
      <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
        {/* Simplified Nigeria outline */}
        <svg
          viewBox="0 0 100 80"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 55 Q10 48 12 40 Q14 32 18 26 Q22 20 28 16 Q34 12 42 10 Q50 8 58 10 Q64 12 68 16 Q72 20 74 26 Q76 32 78 38 Q80 44 78 50 Q76 56 72 60 Q68 64 62 66 Q56 68 50 67 Q44 66 38 64 Q32 62 26 60 Q20 58 15 55Z"
            stroke="#1B4332"
            strokeWidth="0.5"
            fill="#1B4332"
            fillOpacity="0.05"
          />
          {hubs.map((hub) => (
            <g key={hub.name}>
              {/* Pulse ring */}
              <motion.circle
                cx={hub.x}
                cy={hub.y}
                r="3"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="0.3"
                initial={{ opacity: 0.6, r: 1.5 }}
                animate={{ opacity: 0, r: 4 }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeOut",
                  delay: Math.random() * 1,
                }}
              />
              {/* Dot */}
              <circle cx={hub.x} cy={hub.y} r="1.5" fill="#C9A84C" />
              {/* Label */}
              <text
                x={hub.x}
                y={hub.y - 3}
                textAnchor="middle"
                className="fill-text-primary text-[2.5px] font-medium"
              >
                {hub.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Link>
  );
}
