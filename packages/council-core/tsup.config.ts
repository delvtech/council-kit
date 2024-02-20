import { defineConfig } from "tsup";

export default defineConfig({
  // Splitting the entry points in foundational packages like this makes it
  // easier for wrapper packages to re-export `*` from some entry points and
  // specific exports from others that it needs to augment or modify.
  // Otherwise, if the wrapper package overwrites any of the exports, it would
  // have to re-export all of the foundational package's exports individually.
  entry: [
    "src/exports/index.ts",
    "src/exports/airdrop.ts",
    "src/exports/council.ts",
    "src/exports/errors.ts",
    "src/exports/contract.ts",
    "src/exports/model.ts",
    "src/exports/proposal.ts",
    "src/exports/token.ts",
    "src/exports/utils.ts",
    "src/exports/vaults.ts",
    "src/exports/vote.ts",
    "src/exports/voter.ts",
    "src/exports/voting.ts",
  ],
  format: ["esm"],
  sourcemap: true,
  dts: true,
  clean: true,
  minify: true,
  shims: true,
  cjsInterop: true,
});
