import { ReadCouncil } from "@delvtech/council-js";
import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { getCouncil } from "src/lib/sdk";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

/**
 * Use a ReadCouncil instance.
 */
export function useReadCouncil({
  chainId,
}: {
  chainId?: SupportedChainId;
} = {}): ReadCouncil {
  chainId ??= useSupportedChainId(chainId);
  return useMemo(() => getCouncil({ chainId }), [chainId]);
}
