/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        graphite: "#111113",
        champagne: "#d9b76f",
        ivory: "#f4efe6",
        smoke: "#9c9a94",
      },
      boxShadow: {
        premium: "0 24px 90px rgba(0, 0, 0, 0.45)",
        gold: "0 0 42px rgba(217, 183, 111, 0.14)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};