import { councilConfigs, SupportedChainId } from "src/config/council.config";
import { CouncilConfig } from "src/config/types";

export function getCouncilConfig(chainId: SupportedChainId) {
  return councilConfigs.find(
    (config) => config.chainId === chainId,
    // Safe to cast since the `SupportedChainId` type only includes configured
    // chain IDs.
  ) as CouncilConfig;
}
