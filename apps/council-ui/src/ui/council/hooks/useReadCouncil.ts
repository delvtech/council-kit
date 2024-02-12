import { ReadCouncil } from "@delvtech/council-viem";
import { useMemo } from "react";
import { sdkCache } from "src/lib/councilSdk";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { PublicClient } from "viem";
import { usePublicClient } from "wagmi";

/**
 * Use a ReadCouncil instance.
 */
export function useReadCouncil(): ReadCouncil {
  const chainId = useSupportedChainId();
  const publicClient = usePublicClient({ chainId }) as PublicClient;

  return useMemo(
    () =>
      new ReadCouncil({
        publicClient,
        cache: sdkCache,
        namespace: "council-viem",
      }),
    [publicClient],
  );
}
