import { ReadWriteCouncil } from "@delvtech/council-js";
import { viemAdapter } from "@delvtech/drift-viem";
import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { sdkCache } from "src/lib/sdk";
import { usePublicClient, useWalletClient } from "wagmi";

/**
 * Use a ReadWriteCouncil instance.
 */
export function useReadWriteCouncil({
  chainId,
}: {
  chainId?: SupportedChainId;
}): ReadWriteCouncil | undefined {
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  return useMemo(() => {
    if (!walletClient || !publicClient) {
      return undefined;
    }

    return new ReadWriteCouncil({
      adapter: viemAdapter({ publicClient, walletClient }),
      cache: sdkCache,
      chainId,
    });
  }, [publicClient, walletClient]);
}
