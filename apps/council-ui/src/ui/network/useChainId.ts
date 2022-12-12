import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/provider";
import { useNetwork } from "wagmi";

export function useChainId(): SupportedChainId {
  const { chain } = useNetwork();
  const chainId = chain?.id ?? chains[0].id;

  return chainId as SupportedChainId;
}
