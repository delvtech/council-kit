import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/network/config";
import { useChainId } from "wagmi";

const allChainIds = chains.map(({ id }) => id);
const defaultChainId = chains[0].id as SupportedChainId;

export function useSupportedChainId(): SupportedChainId {
  const chainId = useChainId() as SupportedChainId;

  if (allChainIds.includes(chainId)) {
    return chainId;
  }

  return defaultChainId;
}
