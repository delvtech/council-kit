import { VaultConfig, VotingContractConfig } from "src/config/CouncilConfig";

export function useVaultConfig(
  address: string | undefined,
  config: VotingContractConfig,
): VaultConfig | undefined {
  return config.vaults.find((vault) => vault.address === address);
}
