module.exports = {
  ...require("@council/prettier-config"),
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
};
