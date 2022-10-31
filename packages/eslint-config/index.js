module.exports = {
  extends: [
    // Default with turbo repo
    "next",
    "turbo",

    // Custom plugins
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:jest-dom/recommended",
    // "plugin:jsx-a11y/recommended",

    /**
     * Prettier must be the last extension in the list.
     * Prettier works best if you disable all other ESLint rules relating to
     * code formatting, and only enable rules that detect potential bugs.
     * (If another active ESLint rule disagrees with prettier about how code
     * should be formatted, it will be impossible to avoid lint errors.)
     */
    "prettier",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
  // Custom overrides
  // TODO @cashd: review
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: {
        "no-undef": ["off"],
        "react-hooks/exhaustive-deps": "error",
      },
    },
    // {
    //   // files: ["**/*.test.ts", "**/*.test.tsx"],
    //   // extends: ["plugin:testing-library/react"],
    // },
  ],
};
