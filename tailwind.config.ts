import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B4332",
        "primary-light": "#2D6A4F",
        accent: "#C9A84C",
        "accent-hover": "#B8963F",
        "bg-offwhite": "#FAFAF7",
        "bg-card": "#F5F2EB",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B7280",
        border: "#E8E5DE",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Helvetica Neue", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        bento: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
