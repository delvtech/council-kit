import { CouncilConfig } from "src/config/CouncilConfig";
import { councilConfigs } from "src/config/council.config";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

export function useCouncilConfig(): CouncilConfig {
  const chainId = useSupportedChainId();
  return councilConfigs[chainId];
}
