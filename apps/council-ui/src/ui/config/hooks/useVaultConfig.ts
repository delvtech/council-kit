import { VaultConfig } from "src/config/CouncilConfig";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";

export function useVaultConfig(
  address: `0x${string}`,
): VaultConfig | undefined {
  const config = useCouncilConfig();
  return config.coreVoting.vaults.find((vault) => vault.address === address);
}
