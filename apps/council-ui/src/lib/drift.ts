import { createDrift, LruSimpleCache } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { getPublicClient, GetPublicClientParameters } from "@wagmi/core";
import { wagmiConfig } from "src/lib/wagmi";

// 1 minute TTL to match the queryClient's staleTime
export const driftCache = new LruSimpleCache({ max: 500, ttl: 60_000 });

export function getDrift(params?: GetPublicClientParameters) {
  const publicClient = getPublicClient(wagmiConfig, params);

  if (!publicClient) {
    throw new Error("No public client found");
  }

  return createDrift({
    adapter: viemAdapter({ publicClient }),
    cache: driftCache,
    chainId: publicClient.chain.id,
  });
}
