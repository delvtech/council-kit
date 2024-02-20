import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatUnitsBalance } from "src/ui/base/formatting/formatUnitsBalance";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { GSCVaultProfileCard } from "src/ui/vaults/gscVault/GscVaultProfileCard";
import { useReadGscVault } from "src/ui/vaults/gscVault/hooks/useReadGscVault";
import { useVaultVotingPower } from "src/ui/vaults/hooks/useVaultVotingPower";
import { LockingVaultProfileCard } from "src/ui/vaults/lockingVault/LockingVaultsProfileCard";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
import { VestingVaultProfileCard } from "src/ui/vaults/vestingVault/VestingVaultProfileCard";
import { getIsGscEligible } from "src/utils/gscVault/getIsGscEligible";

interface VoterVaultsListProps {
  account: `0x${string}`;
}

export function VoterVaultsList({
  account,
}: VoterVaultsListProps): ReactElement {
  const coreVoting = useReadCoreVoting();
  const config = useCouncilConfig();
  const gscVault = useReadGscVault();
  const { data: isGSCRelevant } = useIsGSCRelevant(account);

  return (
    <div className="grid w-full grid-flow-row grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* core voting vaults */}
      {coreVoting.vaults.map((vault) => {
        const vaultConfig = config.coreVoting.vaults.find(
          (v) => v.address === vault.address,
        );

        switch (vaultConfig?.type) {
          case "LockingVault":
          case "FrozenLockingVault":
            return (
              <LockingVaultProfileCard
                key={vault.address}
                address={vault.address}
                profileAddress={account}
              />
            );
          case "VestingVault":
            return (
              <VestingVaultProfileCard
                key={vault.address}
                address={vault.address}
                profileAddress={account}
              />
            );
          default:
            return (
              <DefaultVaultProfileCard
                address={account}
                profileAddress={account}
              />
            );
        }
      })}

      {/* gsc vault */}
      {isGSCRelevant && !!gscVault && (
        <GSCVaultProfileCard
          address={gscVault.address}
          profileAddress={account}
        />
      )}
    </div>
  );
}

/**
 * Get a boolean indicating that the GSC is relevant to this voter because they
 * are either a member or eligible.
 */
function useIsGSCRelevant(account: `0x${string}`): UseQueryResult<boolean> {
  const gscVault = useReadGscVault();
  const coreVoting = useReadCoreVoting();
  return useQuery({
    queryKey: ["is-gsc-relevant", account],
    queryFn: async () => {
      if (!gscVault) {
        return false;
      }
      if (await gscVault.getIsMember({ account })) {
        return true;
      }
      return getIsGscEligible({
        account,
        gscVault,
        qualifyingVaults: coreVoting.vaults,
      });
    },
  });
}

interface DefaultVaultProfileCardProps {
  address: `0x${string}`;
  profileAddress: `0x${string}`;
}

function DefaultVaultProfileCard({
  address,
  profileAddress,
}: DefaultVaultProfileCardProps) {
  const { votingPower } = useVaultVotingPower({
    vaultAddress: address,
    account: profileAddress,
  });
  const name = `Voting Vault ${formatAddress(address)}`;

  if (!votingPower) {
    return <VaultProfileCardSkeleton address={address} name={name} />;
  }

  return (
    <VaultProfileCard
      address={address}
      name={name}
      stats={[
        {
          label: "Voting Power",
          value: votingPower
            ? formatUnitsBalance({ balance: votingPower })
            : "None",
        },
      ]}
    />
  );
}
