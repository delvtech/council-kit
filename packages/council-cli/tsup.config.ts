// import tsconfigPaths from "tsconfig-paths";
import { defineConfig } from "tsup";

// tsconfigPaths.register();

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["cjs"],
  sourcemap: true,
  dts: false,
  clean: true,
  minify: true,
  shims: true,
});
