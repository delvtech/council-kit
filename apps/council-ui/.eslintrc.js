module.exports = {
  root: true,
  extends: [
    "next",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    // Removes the requirement to import `React` when you use jsx
    "plugin:react/jsx-runtime",
    "plugin:tailwindcss/recommended",
    // @council/eslint-config needs to be the last config extended because it includes prettier
    "@council/eslint-config",
  ],
  rules: {
    "tailwindcss/classnames-order": "off", // Disable ordering in favor of prettier plugin,
    "@typescript-eslint/no-non-null-assertion": "off", // non-null assertions are useful when working with hooks
  },
};
