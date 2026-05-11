/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#059669",
        "primary-dark": "#047857",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.06)",
        elevated: "0 4px 24px rgba(0,0,0,0.10)",
        glow: "0 0 20px rgba(5,150,105,0.35)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
