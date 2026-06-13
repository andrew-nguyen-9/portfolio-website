import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark theme — Kyoto Listening Bar
        "dark-bg":        "#222B28",
        "dark-surface":   "#313833",
        "dark-primary":   "#A8B8A1",
        "dark-secondary": "#D06D43",
        "dark-highlight": "#E2BE6D",
        "dark-text":      "#F8F4EB",
        // Light theme — Warm Library
        "light-bg":        "#F8F4EB",
        "light-surface":   "#E6D9C7",
        "light-primary":   "#506354",
        "light-secondary": "#B85A30",
        "light-highlight": "#A47C2F",
        "light-text":      "#2A2A2A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        heading:  ["var(--font-ibm-plex-serif)", "Georgia", "serif"],
        sans:     ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono:     ["var(--font-jetbrains-mono)", "'Courier New'", "monospace"],
      },
      keyframes: {
        "vinyl-spin": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "counter-spin": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(-360deg)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-in": {
          "0%":   { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "vinyl-spin":    "vinyl-spin 4s linear infinite",
        "counter-spin":  "counter-spin 4s linear infinite",
        "fade-up":       "fade-up 0.6s ease-out forwards",
        "draw-in":       "draw-in 0.8s ease-in-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
