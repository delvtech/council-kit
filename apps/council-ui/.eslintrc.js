module.exports = {
  root: true,
  extends: [
    "next",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    // Removes the requirement to import `React` when you use jsx
    "plugin:react/jsx-runtime",
    "plugin:tailwindcss/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    // @council/eslint-config needs to be the last config extended because it includes prettier
    "@council/eslint-config",
  ],
  rules: {
    // Disable ordering in favor of prettier plugin
    "tailwindcss/classnames-order": "off",
    // Disabled because it catches things like Date and other constructors that
    // don't need to be in the queryKey
    "@tanstack/query/exhaustive-deps": "off",
  },
};
