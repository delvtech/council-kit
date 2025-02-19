import { createCouncil } from "@delvtech/council-js";
import { LruSimpleCache } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { GetPublicClientParameters, getPublicClient } from "@wagmi/core";
import { wagmiConfig } from "src/lib/wagmi";

// 1 minute TTL to match the queryClient's staleTime
export const sdkCache = new LruSimpleCache({ max: 500, ttl: 60_000 });

export function getCouncil(params?: GetPublicClientParameters) {
  const publicClient = getPublicClient(wagmiConfig, params);

  if (!publicClient) {
    throw new Error("No public client found");
  }

  return createCouncil({
    adapter: viemAdapter({ publicClient }),
    cache: sdkCache,
    chainId: publicClient.chain.id,
  });
}
