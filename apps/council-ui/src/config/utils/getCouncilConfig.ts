import { councilConfigs, SupportedChainId } from "src/config/council.config";
import { CouncilConfig } from "src/config/types";

export type Config<C extends SupportedChainId> = CouncilConfig &
  Extract<(typeof councilConfigs)[number], { chainId: C }>;

export function getCouncilConfig<C extends SupportedChainId>(chainId: C) {
  return councilConfigs.find(
    (config) => config.chainId === chainId,
  ) as Config<C>;
}
