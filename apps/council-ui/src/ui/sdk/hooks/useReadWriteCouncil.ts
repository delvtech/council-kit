import { createCouncil } from "@delvtech/council-js";
import { viemAdapter } from "@delvtech/drift-viem";
import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { driftCache } from "src/lib/drift";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { usePublicClient, useWalletClient } from "wagmi";

/**
 * Use a ReadWriteCouncil instance.
 */
export function useReadWriteCouncil({
  chainId,
}: {
  chainId?: SupportedChainId;
} = {}) {
  chainId = useSupportedChainId(chainId);
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  return useMemo(() => {
    if (!walletClient || !publicClient) {
      return undefined;
    }
    return createCouncil({
      adapter: viemAdapter({ publicClient, walletClient }),
      cache: driftCache,
      chainId,
    });
  }, [publicClient, walletClient]);
}
