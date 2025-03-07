import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { getGscVaultConfig } from "src/config/utils/getGscVaultConfig";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
import { useKickGscMember } from "src/ui/vaults/gscVault/hooks/useKickGscMember";
import { getVotingPower } from "src/utils/vaults/getVotingPower";
import { getGscStatus, isGscMember } from "src/utils/vaults/gsc/getGscStatus";

interface GSCVaultProfileCardProps {
  address: `0x${string}`;
  profileAddress: `0x${string}`;
}

export function GSCVaultProfileCard({
  address,
  profileAddress,
}: GSCVaultProfileCardProps): ReactElement {
  const { data } = useGSCVaultProfileCardData(address, profileAddress);
  const chainId = useSupportedChainId();
  const vaultConfig = getGscVaultConfig({ chainId });
  const name = vaultConfig?.name || "GSC Vault";

  const { write: kickGscMember } = useKickGscMember();

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
          !isGscMember(gscStatus) ||
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
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const enabled = !!council;

  return useQuery({
    queryKey: [
      "gsc-vault-profile-card",
      { userAddress: account, vaultAddress },
    ],
    enabled,
    queryFn: enabled
      ? async () => {
          const gscVault = council?.gscVault(vaultAddress);

          const [requiredVotingPower, qualifyingVaults, gscStatus] =
            await Promise.all([
              gscVault.getRequiredVotingPower(),
              gscVault.getMemberVaults(account),
              getGscStatus({ account, chainId }),
            ]);

          const votingPowers = await Promise.all(
            qualifyingVaults.map(({ address }) =>
              getVotingPower({
                chainId,
                vault: address,
                voter: account,
              }),
            ),
          );

          const qualifyingVotingPower = votingPowers.reduce(
            (total, vaultPower) => total + vaultPower,
            0n,
          );

          return {
            requiredVotingPower,
            qualifyingVotingPower,
            isBelowThreshold: qualifyingVotingPower < requiredVotingPower,
            gscStatus,
          };
        }
      : undefined,
  });
}
