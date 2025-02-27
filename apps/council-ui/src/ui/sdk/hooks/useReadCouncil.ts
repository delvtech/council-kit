import { createCouncil, ReadCouncil } from "@delvtech/council-js";
import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { getDrift } from "src/lib/drift";
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
  return useMemo(
    () =>
      createCouncil({
        drift: getDrift({ chainId }),
      }),
    [chainId],
  );
}
