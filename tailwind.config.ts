import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Digital Frontier — obsidian canvas
        obsidian: {
          DEFAULT: "#050607",
          900: "#050607",
        },
        canvas: "#050607",
        surface: {
          DEFAULT: "#111317",
          1: "#1a1c20",
          2: "#1e2024",
          variant: "#333539",
        },
        "on-surface": "#e2e2e8",
        "on-surface-variant": "#b9cacb",
        // Primary accent — football cyan (the "AI brain")
        primary: {
          DEFAULT: "#00F0FF",
          soft: "#7df4ff",
        },
        "football-cyan": "#00F0FF",
        // Sport accents
        sport: {
          football: "#00F0FF",
          hockey: "#FF3B3B",
          basketball: "#FF8A00",
          baseball: "#00FF66",
        },
        "hockey-red": "#FF3B3B",
        "basketball-orange": "#FF8A00",
        "baseball-green": "#00FF66",
        glass: "rgba(255,255,255,0.10)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-hero": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        glow: "0 0 20px 0 rgba(0,240,255,0.25)",
        "glow-red": "0 0 20px 0 rgba(255,59,59,0.25)",
      },
      backdropBlur: {
        glass: "32px",
      },
      keyframes: {
        pulseBorder: {
          "0%, 100%": { borderColor: "rgba(0,240,255,0.25)" },
          "50%": { borderColor: "rgba(0,240,255,0.8)" },
        },
      },
      animation: {
        "pulse-border": "pulseBorder 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
