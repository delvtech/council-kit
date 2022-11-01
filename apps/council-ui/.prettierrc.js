module.exports = {
  ...require("@delve/prettier-config"),
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.js',
};
