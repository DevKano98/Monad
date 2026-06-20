import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        signal: "#0f766e",
        caution: "#b45309",
        surface: "#f8fafc",
        canvas: "#f4f1eb",
        panel: "#ffffff",
        panelMuted: "#f5f6f7",
        panelDark: "#0b0d12",
        panelDarkSoft: "#12161d",
        line: "#d6d9e0",
        lineDark: "rgba(255, 255, 255, 0.1)",
        primary: "#494fdf",
        primaryStrong: "#3a40c4",
        primarySoft: "#e4e7ff",
        textMuted: "#5c6675",
        accentPink: "#e61e49",
        accentTeal: "#00a87e",
        accentBlue: "#007bc2",
        accentWarning: "#ec7e00"
      }
    }
  },
  plugins: []
} satisfies Config;
