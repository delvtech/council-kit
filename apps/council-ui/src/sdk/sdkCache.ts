import { createLruSimpleCache } from "@delvtech/council-viem";

export const sdkCache = createLruSimpleCache({ max: 500 });
