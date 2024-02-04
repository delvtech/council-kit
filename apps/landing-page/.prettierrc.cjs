const base = require("@council/prettier-config");

module.exports = {
  ...base,
  plugins: [
    ...base.plugins,
    require("prettier-plugin-tailwindcss"),
  ],
  tailwindConfig: "./tailwind.config.cjs",
};