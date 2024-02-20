import { ReadWriteCouncil } from "@delvtech/council-viem";
import { useMemo } from "react";
import { sdkCache } from "src/lib/councilSdk";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { usePublicClient, useWalletClient } from "wagmi";

/**
 * Use a ReadWriteCouncil instance.
 */
export function useReadWriteCouncil(): ReadWriteCouncil | undefined {
  const chainId = useSupportedChainId();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  return useMemo(() => {
    if (!walletClient || !publicClient) {
      return undefined;
    }

    return new ReadWriteCouncil({
      publicClient,
      walletClient,
      cache: sdkCache,
      namespace: "council-viem",
    });
  }, [publicClient, walletClient]);
}
