import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["cjs"],
  sourcemap: false,
  dts: false,
  clean: true,
  minify: true,
  shims: true,
});
