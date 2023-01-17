import { CouncilConfig } from "src/config/CouncilConfig";
import { goerliCouncilConfig } from "src/config/goerli";
import { mainnetCouncilConfig } from "src/config/mainnet";

export type SupportedChainId = 1 | 5;

export const councilConfigs: Record<SupportedChainId, CouncilConfig> = {
  1: mainnetCouncilConfig,
  5: goerliCouncilConfig,
};
