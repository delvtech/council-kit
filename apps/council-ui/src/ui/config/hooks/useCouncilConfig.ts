import { SupportedChainId } from "src/config/council.config";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

export function useCouncilConfig<C extends SupportedChainId>(chainId?: C) {
  chainId = useSupportedChainId(chainId);
  const config = getCouncilConfig(chainId);
  if (!config) {
    throw new Error(`No config for chain ID ${chainId}`);
  }
  return config;
}
