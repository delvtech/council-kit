import { SupportedChainId, councilConfigs } from "src/config/council.config";
import { CouncilConfig } from "src/config/CouncilConfig";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";

export function useCouncilConfig({
  chainId,
}: {
  chainId?: SupportedChainId;
} = {}) {
  chainId = useSupportedChainId(chainId);
  return councilConfigs[chainId] as CouncilConfig & {
    chainId: SupportedChainId;
  };
}
