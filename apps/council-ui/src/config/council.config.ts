import { CouncilConfig } from "src/config/CouncilConfig";
import { mainnetCouncilConfig } from "src/config/mainnet";

export type SupportedChainId = 1 | 5;

export const councilConfigs: Record<number, CouncilConfig> = {
  1: mainnetCouncilConfig,
  // Uncomment this to test things on goerli
  // 5: goerliCouncilConfig,
};
