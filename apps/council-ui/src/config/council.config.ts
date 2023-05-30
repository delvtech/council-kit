import { CouncilConfig } from "src/config/CouncilConfig";
import { goerliCouncilConfig } from "src/config/goerli";
import { localhostCouncilConfig } from "src/config/localhost";
import { mainnetCouncilConfig } from "src/config/mainnet";
import { mumbaiCouncilConfig } from "src/config/mumbai";

export type SupportedChainId = 1 | 5 | 80001 | 31337;

export const councilConfigs: Record<SupportedChainId, CouncilConfig> = {
  1: mainnetCouncilConfig,
  5: goerliCouncilConfig,
  80001: mumbaiCouncilConfig,
  31337: localhostCouncilConfig,
};
