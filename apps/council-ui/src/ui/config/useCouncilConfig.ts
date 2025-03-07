import { SupportedChainId } from "src/config/council.config";
import { CouncilConfig } from "src/config/types";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";

export function useCouncilConfig<T extends SupportedChainId>(chainId?: T) {
  chainId = useSupportedChainId(chainId);
  const config = getCouncilConfig(chainId);
  if (!config) {
    throw new Error(`No config for chain ID ${chainId}`);
  }
  return config as CouncilConfig & { chainId: T };
}
