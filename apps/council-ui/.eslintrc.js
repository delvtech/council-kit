module.exports = {
  root: true,
  extends: [
    "next",
    "plugin:react-hooks/recommended",
    "plugin:tailwindcss/recommended",
    // @delve/eslint-config needs to be the last config extended because it includes prettier
    "@delve/eslint-config",
  ],
  overrides: {
    "tailwindcss/classnames-order": "off", // Disable ordering in favor of prettier plugin
  },
};
