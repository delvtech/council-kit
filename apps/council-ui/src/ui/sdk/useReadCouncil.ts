import { createCouncil } from "@delvtech/council-js";
import { viemAdapter } from "@delvtech/drift-viem";
import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { driftStore } from "src/lib/drift";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { usePublicClient } from "wagmi";

/**
 * Use a ReadCouncil instance.
 */
export function useReadCouncil({
  chainId,
}: {
  chainId?: SupportedChainId;
} = {}) {
  chainId = useSupportedChainId(chainId);
  const publicClient = usePublicClient({ chainId });

  return useMemo(() => {
    if (!publicClient) {
      return undefined;
    }
    return createCouncil({
      adapter: viemAdapter({ publicClient }),
      store: driftStore,
      chainId,
    });
  }, [publicClient]);
}
