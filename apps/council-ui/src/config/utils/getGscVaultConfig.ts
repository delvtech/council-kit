import { SupportedChainId } from "src/config/council.config";
import { VaultConfig } from "src/config/types";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";

export function getGscVaultConfig({
  chainId,
}: {
  chainId: SupportedChainId;
}): ExtendedGscVaultConfig | undefined {
  const { gscVoting } = getCouncilConfig(chainId);
  const vaultConfig = gscVoting?.vaults[0];
  if (vaultConfig) {
    return {
      ...vaultConfig,
      chainId,
      type: "GSCVault",
      isGsc: true,
    };
  }
}

export type ExtendedGscVaultConfig = VaultConfig & {
  chainId: SupportedChainId;
  type: "GSCVault";
  isGsc: true;
};
