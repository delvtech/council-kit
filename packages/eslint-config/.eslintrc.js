module.exports = {
  extends: [
    "turbo",

    // Custom plugins
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
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
    "@typescript-eslint/explicit-module-boundary-types": "error", // exported functions must have return types
    "@typescript-eslint/no-empty-function": "off", // empty arrow functions are fine for noops when passed to components
    "@typescript-eslint/no-empty-interface": "off", // empty interfaces for component props should be allowed
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^unused",
        varsIgnorePattern: "^unused",
      },
    ],
    "import/no-unused-modules": "error",
    curly: "error",
    "no-console": [
      "warn",
      {
        allow: ["warn", "error", "info", "assert"],
      },
    ],
    "no-new-func": "error", // const func = new Function()
    "no-restricted-imports": [
      "error",
      {
        patterns: ["\\.\\./*"],
      },
    ],
    "prefer-template": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {
        // Tell eslint-config where to find the tsconfig when it runs, see:
        // https://www.npmjs.com/package/eslint-import-resolver-typescript
        project: "{apps,packages}/**/*/tsconfig.json",
      },
      // always try to resolve types under `<root>@types` directory even it doesn't contain any
      // source code, like `@types/unist`
      "eslint-import-resolver-typescript": {
        alwaysTryTypes: true,
      },
    },
  },
};
