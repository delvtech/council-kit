import { useMemo } from "react";
import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/lib/wagmi";
import { useChainId } from "wagmi";

const allChainIds = chains.map(({ id }) => id);
const defaultChainId = chains[0].id as SupportedChainId;

export function useSupportedChainId(
  chainId?: SupportedChainId,
): SupportedChainId {
  const connectedChainId = useChainId() as SupportedChainId;
  chainId ??= connectedChainId;

  return useMemo(() => {
    if (allChainIds.includes(chainId)) {
      return chainId;
    }
    return defaultChainId;
  }, [chainId]);
}
