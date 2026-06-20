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
        surface: "#f8fafc"
      }
    }
  },
  plugins: []
} satisfies Config;
