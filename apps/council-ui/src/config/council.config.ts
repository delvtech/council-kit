import { goerliCouncilConfig } from "src/config/goerli";
import { localhostCouncilConfig } from "src/config/localhost";
import { mainnetCouncilConfig } from "src/config/mainnet";
import { CouncilConfig } from "src/config/types";

export const councilConfigs = [
  mainnetCouncilConfig,
  goerliCouncilConfig,
  localhostCouncilConfig,
] satisfies CouncilConfig[];

export type SupportedChainId = (typeof councilConfigs)[number]["chainId"];
