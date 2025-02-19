import { ReadCouncil } from "@delvtech/council-js";
import { viemAdapter } from "@delvtech/drift-viem";
import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { sdkCache } from "src/lib/sdk";
import { usePublicClient } from "wagmi";

/**
 * Use a ReadCouncil instance.
 */
export function useReadCouncil({
  chainId,
}: {
  chainId?: SupportedChainId;
} = {}): ReadCouncil {
  const publicClient = usePublicClient({ chainId });

  return useMemo(() => {
    if (!publicClient) {
      throw new Error("Public client is not available");
    }

    return new ReadCouncil({
      adapter: viemAdapter({ publicClient }),
      cache: sdkCache,
      chainId,
    });
  }, [chainId]);
}
