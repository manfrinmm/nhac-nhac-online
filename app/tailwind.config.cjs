/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#5a6592",
        primary: "#2e355c",
        // secondary: "#c1d8ff",
        secondary: "#d3d7e9",
        background: "#d3d7e9",
      },
    },
  },
  plugins: [],
};
