/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#0b0614",
        graphite: "#171022",
        champagne: "#c9a968",
        ivory: "#f7f1ff",
        smoke: "#a99fba",
      },
      boxShadow: {
        premium: "0 24px 90px rgba(11, 6, 20, 0.62)",
        gold: "0 0 42px rgba(201, 169, 104, 0.18)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};