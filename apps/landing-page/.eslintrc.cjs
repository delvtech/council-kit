module.exports = {
  root: true,
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    // Removes the requirement to import `React` when you use jsx
    "plugin:react/jsx-runtime",
    "plugin:tailwindcss/recommended",
    // @council/eslint-config needs to be the last config extended because it includes prettier
    "@council/eslint-config",
  ],
  rules: {
    // Disable ordering in favor of prettier plugin
    "tailwindcss/classnames-order": "off",
    "tailwindcss/no-custom-classname": "off",
  },
  ignorePatterns: ["**/*.cjs"]
};