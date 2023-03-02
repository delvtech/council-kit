/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  // load environment variables from .env
  setupFiles: ["dotenv/config"],
  moduleNameMapper: {
    // rewrite paths configured in tsconfig
    "src/(.*)": "<rootDir>/src/$1",
  },
  transform: {
    // transform .ts files into es modules.
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
