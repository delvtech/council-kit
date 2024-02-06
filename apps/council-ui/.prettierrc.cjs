const repoConfig = require("@council/prettier-config");

module.exports = {
  ...repoConfig,
  plugins: [...repoConfig.plugins, "prettier-plugin-tailwindcss"],
};
