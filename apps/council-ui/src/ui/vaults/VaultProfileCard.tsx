import assertNever from "assert-never";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useChainId } from "src/ui/network/useChainId";
import { LockingVaultProfileCard } from "src/ui/vaults/lockingVault/LockingVaultsProfileCard";
import { VestingVaultProfileCard } from "src/ui/vaults/vestingVault/VestingVaultProfileCard";
import { VoterDataByTokenWithDelegationVault } from "src/vaults/getVoterDataByTokenWithDelegationVault";
import { getAllVaults } from "src/vaults/vaults";

interface VaultProfileCardProps {
  /** The address of the voting vault */
  vaultAddress: string;
  /** Voter data fetched from this specific vault */
  voterData: VoterDataByTokenWithDelegationVault;
  /** The address of the voter profile */
  voterAddress: string;
  /** The ens of the voter profile */
  voterEns?: string;
}

export function VaultProfileCard({
  vaultAddress,
  voterData,
  voterAddress,
  voterEns,
}: VaultProfileCardProps): ReactElement {
  const { replace } = useRouter();
  const chainId = useChainId();
  const allVaults = getAllVaults(chainId);
  const vaultConfig = allVaults.find((vault) => vault.address === vaultAddress);

  if (!vaultConfig) {
    replace("/404");
    // User will go to 404 page if this block is reached
    // Returning empty fragment is to remove the undefined type from vaultConfig below
    return <></>;
  }

  switch (vaultConfig.type) {
    case "LockingVault":
      return (
        <LockingVaultProfileCard
          vaultAddress={vaultAddress}
          userAddress={voterAddress}
          userVotingPower={voterData.votingPower}
          userCurrentDelegate={voterData.currentDelegate}
          userBalance={voterData.balance}
          userVotersDelegated={voterData.votersDelegated}
          userEns={voterEns}
        />
      );

    case "VestingVault":
      return (
        <VestingVaultProfileCard
          vaultAddress={vaultAddress}
          userAddress={voterAddress}
          userVotingPower={voterData.votingPower}
          userCurrentDelegate={voterData.currentDelegate}
          userBalance={voterData.balance}
          userVotersDelegated={voterData.votersDelegated}
          userEns={voterEns}
        />
      );

    case "GSCVault":
      return <></>;

    default:
      return assertNever(vaultConfig.type);
  }
}
