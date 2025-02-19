import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    alias: {
      "src/": "/src/",
    },
    coverage: {
      // get coverage for all of source except the example dir
      include: ["./src/**/*.ts"],
    },
  },
});
