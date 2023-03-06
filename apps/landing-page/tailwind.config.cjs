/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5E53BF",
        "primary-hover": "#473DA4",
        "primary-dim": "#554CAD",
        "primary-20": "rgba(183, 176, 244, .2)",
        "primary-text": "#9F95F5",
        "primary-text-light": "#B7B0F4",
        "primary-white": "#E1DEFF",
        dark: "#120F1B",
        black: "#0C0916",
      },
    },
  },
  plugins: [],
};
