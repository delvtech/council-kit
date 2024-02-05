module.exports = {
  ...require("@council/prettier-config"),
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("prettier-plugin-organize-imports"),
  ],
  tailwindConfig: "./tailwind.config.js",
};
