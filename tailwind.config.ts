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
        "bg-cream": "#FAFAF7",
        "bg-card": "#EDE6D6",
        "bg-dark": "#0F0D09",
        "bg-green": "#1B4332",
        "text-primary": "#1A1A1A",
        "text-secondary": "#9A9285",
        border: "#E8E5DE",
        red: "#C44A2A",
        gold: "#C9A84C",
        cream: "#EDE6D6",
      },
      fontFamily: {
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
