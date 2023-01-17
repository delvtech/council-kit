import { councilConfigs, SupportedChainId } from "src/config/council.config";
import { VaultConfig } from "src/config/CouncilConfig";

export function getAllVaults(chainId: SupportedChainId): VaultConfig[] {
  const allVaults = [
    ...councilConfigs[chainId].coreVoting.vaults,
    ...(councilConfigs[chainId].gscVoting?.vaults || []),
  ];
  return allVaults;
}
