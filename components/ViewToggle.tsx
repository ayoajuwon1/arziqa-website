"use client";

import { useView } from "./ViewContext";
import { motion } from "framer-motion";

export default function ViewToggle() {
  const { view, setView } = useView();

  return (
    <div className="relative flex items-center rounded-full border border-border bg-white/80 backdrop-blur-sm p-0.5">
      <button
        onClick={() => setView("full")}
        className="relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200"
        style={{ color: view === "full" ? "#fff" : "#1A1A1A" }}
      >
        Full view
      </button>
      <button
        onClick={() => setView("overview")}
        className="relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-200"
        style={{ color: view === "overview" ? "#fff" : "#1A1A1A" }}
      >
        Overview
      </button>
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full bg-primary"
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          left: view === "full" ? "2px" : "50%",
          right: view === "full" ? "50%" : "2px",
        }}
      />
    </div>
  );
}
