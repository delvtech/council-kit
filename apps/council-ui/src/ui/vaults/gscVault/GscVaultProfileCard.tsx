import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
import { useGscStatus } from "src/ui/vaults/gscVault/hooks/useGscStatus";
import { useKickGscMember } from "src/ui/vaults/gscVault/hooks/useKickGscMember";
import { getIsGscMember } from "src/utils/gscVault/getGscStatus";
import { useReadGscVault } from "./hooks/useReadGscVault";

interface GSCVaultProfileCardProps {
  address: `0x${string}`;
  profileAddress: `0x${string}`;
}

export function GSCVaultProfileCard({
  address,
  profileAddress,
}: GSCVaultProfileCardProps): ReactElement {
  const { data } = useGSCVaultProfileCardData(address, profileAddress);

  // config
  const config = useCouncilConfig();
  const name = config.gscVoting?.vault?.name || "GSC Vault";

  // kick transaction
  const { kickGscMember } = useKickGscMember();

  if (!data) {
    return <VaultProfileCardSkeleton address={address} name={name} />;
  }

  const {
    gscStatus,
    isBelowThreshold,
    requiredVotingPower,
    qualifyingVotingPower,
  } = data;

  return (
    <VaultProfileCard
      address={address}
      name={name}
      stats={[
        {
          label: "Membership status",
          value: gscStatus,
        },
        {
          label: "Required voting power",
          value: formatVotingPower(requiredVotingPower),
        },
        {
          label: "Qualifying voting power",
          value: formatVotingPower(qualifyingVotingPower),
        },
      ]}
      button={{
        text: "Kick Member",
        disabled:
          !gscStatus ||
          !getIsGscMember(gscStatus) ||
          !isBelowThreshold ||
          !kickGscMember,
        onClick: () => kickGscMember?.(profileAddress),
      }}
    />
  );
}

function useGSCVaultProfileCardData(
  vaultAddress: `0x${string}`,
  account: `0x${string}`,
) {
  const coreVoting = useReadCoreVoting();
  const gscVault = useReadGscVault();
  const { gscStatus } = useGscStatus(account);
  const enabled = !!gscVault;

  return useQuery({
    queryKey: [
      "gsc-vault-profile-card",
      { userAddress: account, vaultAddress },
    ],
    enabled,
    queryFn: enabled
      ? async () => {
          const qualifyingVotingPower = await coreVoting.getVotingPower({
            account,
          });
          const requiredVotingPower = await gscVault.getRequiredVotingPower();
          const isBelowThreshold = qualifyingVotingPower < requiredVotingPower;

          return {
            isBelowThreshold,
            requiredVotingPower,
            qualifyingVotingPower,
            gscStatus,
          };
        }
      : undefined,
  });
}
