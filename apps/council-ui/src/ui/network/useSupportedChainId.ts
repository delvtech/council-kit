import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/lib/wagmi";
import { useChainId } from "wagmi";

export function useSupportedChainId<T extends SupportedChainId>(
  chainId?: T,
): T {
  chainId ??= useChainId() as T;

  if (chains[chainId]) {
    return chainId as T;
  }

  return +Object.keys(chains)[0] as T;
}
