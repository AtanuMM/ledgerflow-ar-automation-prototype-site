/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        canvas: "#f5f7f4",
        moss: {
          50: "#eef7f1",
          100: "#dceee2",
          500: "#3c8c5b",
          600: "#2e7047",
          700: "#255a3a",
        },
      },
      boxShadow: {
        soft: "0 12px 40px rgba(32, 54, 41, 0.07)",
      },
    },
  },
  plugins: [],
}

