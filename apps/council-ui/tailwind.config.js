/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/ui/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    prefix: "daisy-",
    themes: [
      {
        elementDaoTheme: {
          primary: "#005EBE", // principal royal blue
          secondary: "#6ACDE2", // principal blue
          accent: "#19C2A3", // topaz
          neutral: "#242E36", // black
          "base-100": "#FFFFFF",
          "base-200": "#F7F8F9",
          "base-300": "#ECEDF2",
          info: "#B2CAE3", // blueGrey
          success: "#007F00", //statusGreen
          warning: "#FFC300", // goldYellow
          error: "#F73030", // deepRed
        },
      },
    ],
  },
};
