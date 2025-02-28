import { Address } from "@delvtech/drift";
import { SupportedChainId } from "src/config/council.config";
import { VaultConfig } from "src/config/types";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";

export function getVaultConfig({
  address,
  chainId,
}: {
  address: Address;
  chainId: SupportedChainId;
}): ExtendedVaultConfig | undefined {
  const { coreVoting, gscVoting } = getCouncilConfig(chainId);

  const foundCoreVotingVault = coreVoting.vaults.find(
    (vault) => vault.address === address,
  );
  if (foundCoreVotingVault) {
    return {
      ...foundCoreVotingVault,
      isGsc: false,
      chainId,
    };
  }

  const foundGscVotingVault = gscVoting?.vaults.find(
    (vault) => vault.address === address,
  );
  if (foundGscVotingVault) {
    return {
      ...foundGscVotingVault,
      isGsc: true,
      chainId,
    };
  }
}

export type ExtendedVaultConfig = VaultConfig & {
  chainId: SupportedChainId;
  isGsc: boolean;
};
