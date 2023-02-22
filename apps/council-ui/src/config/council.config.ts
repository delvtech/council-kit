import { CouncilConfig } from "src/config/CouncilConfig";
import { mainnetCouncilConfig } from "src/config/mainnet";

// Uncomment this to test things on goerli
// export type SupportedChainId = 1 | 5;
export type SupportedChainId = 1;

export const councilConfigs: Record<SupportedChainId, CouncilConfig> = {
  1: mainnetCouncilConfig,
  // Uncomment this to test things on goerli
  // 5: goerliCouncilConfig,
};
