import { CouncilConfig } from "src/config/CouncilConfig";
import { goerliCouncilConfig } from "src/config/goerli";
import { localhostCouncilConfig } from "src/config/localhost";
import { mainnetCouncilConfig } from "src/config/mainnet";

export type SupportedChainId = 1 | 5 | 31337;

export const councilConfigs: Record<SupportedChainId, CouncilConfig> = {
  1: mainnetCouncilConfig,
  5: goerliCouncilConfig,
  31337: localhostCouncilConfig,
};
