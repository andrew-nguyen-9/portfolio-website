import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg":        "#1C2620",
        "dark-surface":   "#243028",
        "dark-primary":   "#89AD9E",
        "dark-secondary": "#9E4A24",
        "dark-highlight": "#C27848",
        "dark-text":      "#E8F0EB",
        "light-bg":        "#F2F7F3",
        "light-surface":   "#D8E8DC",
        "light-primary":   "#3F6B52",
        "light-secondary": "#9E4A24",
        "light-highlight": "#7A9A88",
        "light-text":      "#1C2620",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans:    ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "Courier New", "monospace"],
      },
      keyframes: {
        "vinyl-spin":   { to: { transform: "rotate(360deg)" } },
        "counter-spin": { to: { transform: "rotate(-360deg)" } },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "vinyl-spin":   "vinyl-spin 4s linear infinite",
        "counter-spin": "counter-spin 4s linear infinite",
        "fade-up":      "fade-up 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
