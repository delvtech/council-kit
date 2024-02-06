import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/extras.ts"],
  format: ["esm"],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  shims: true,
  cjsInterop: true,
});
