import { councilConfigs, SupportedChainId } from "src/config/council.config";
import { VaultConfig } from "src/config/CouncilConfig";

export function getAllVaultConfigs(chainId: SupportedChainId): VaultConfig[] {
  const allVaults = [
    ...getCoreVotingVaults(chainId),
    ...getGSCCoreVotingVaults(chainId),
  ];
  return allVaults;
}

export function getCoreVotingVaults(chainId: SupportedChainId): VaultConfig[] {
  return councilConfigs[chainId].coreVoting.vaults;
}

export function getGSCCoreVotingVaults(
  chainId: SupportedChainId,
): VaultConfig[] {
  return councilConfigs[chainId].gscVoting?.vaults || [];
}
