import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/provider";
import { useNetwork } from "wagmi";

const defaultChainId = chains[0].id as SupportedChainId;

export function useChainId(): SupportedChainId {
  const { chain } = useNetwork();

  if (!chain?.id || !chains.find(({ id }) => id === chain.id)) {
    return defaultChainId;
  } else {
    return chain.id as SupportedChainId;
  }
}
