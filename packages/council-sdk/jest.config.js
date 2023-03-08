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
    // transform .ts files into es modules
    "^.+\\.ts$": [
      "ts-jest",
      {
        // use a tsconfig with an es5 target
        tsconfig: "tsconfig.test.json",
        useESM: true,
      },
    ],
  },
  // get coverage for all of source except the example dir
  collectCoverageFrom: ["./src/{!(example),}/**/*.ts"],
};
