import { ReadWriteCouncil } from "@delvtech/council-viem";
import { useMemo } from "react";
import { sdkCache } from "src/sdk/sdkCache";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { PublicClient, WalletClient } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

/**
 * Use a ReadWriteCouncil instance.
 */
export function useReadWriteCouncil(): ReadWriteCouncil | undefined {
  const chainId = useSupportedChainId();
  const publicClient = usePublicClient({ chainId }) as PublicClient;
  const walletClient = useWalletClient({ chainId }) as unknown as WalletClient;
  const { isConnected } = useAccount();

  return useMemo(
    () =>
      isConnected
        ? new ReadWriteCouncil({
            publicClient,
            walletClient,
            cache: sdkCache,
            namespace: "council-viem",
          })
        : undefined,
    [isConnected, publicClient, walletClient],
  );
}
