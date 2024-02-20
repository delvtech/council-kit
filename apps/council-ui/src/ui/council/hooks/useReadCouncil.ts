import { ReadCouncil } from "@delvtech/council-viem";
import { useMemo } from "react";
import { sdkCache } from "src/lib/councilSdk";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { usePublicClient } from "wagmi";

/**
 * Use a ReadCouncil instance.
 */
export function useReadCouncil(): ReadCouncil {
  const chainId = useSupportedChainId();
  const publicClient = usePublicClient({ chainId });

  return useMemo(() => {
    if (!publicClient) {
      throw new Error("Public client is not available");
    }

    return new ReadCouncil({
      publicClient,
      cache: sdkCache,
      namespace: "council-viem",
    });
  }, [publicClient]);
}
