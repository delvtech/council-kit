import { VaultConfig } from "src/config/CouncilConfig";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";

export function useVaultConfig(
  address: `0x${string}` | undefined,
): VaultConfig | undefined {
  const config = useCouncilConfig();

  if (config.gscVoting?.vault?.address === address) {
    return config.gscVoting?.vault;
  }

  return config.coreVoting.vaults.find((vault) => vault.address === address);
}
