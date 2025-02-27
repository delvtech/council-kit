import { SupportedChainId } from "src/config/council.config";
import { chains } from "src/lib/wagmi";
import { useChainId } from "wagmi";

const allChainIds = chains.map(({ id }) => id);

export function useSupportedChainId<T extends SupportedChainId>(
  chainId?: T,
): T {
  chainId ??= useChainId() as T;

  if (allChainIds.includes(chainId)) {
    return chainId as T;
  }

  return chains[0].id as T;
}
