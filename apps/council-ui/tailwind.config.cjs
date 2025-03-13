/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/{pages,ui}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("daisyui"),
  ],
  daisyui: {
    prefix: "daisy-",
  },
};
