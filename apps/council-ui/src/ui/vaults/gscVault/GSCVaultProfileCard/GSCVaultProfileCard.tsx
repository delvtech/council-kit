import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import { useKickGSCMember } from "src/ui/vaults/gscVault/useKickGSCMember";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
import { getIsGSCMember } from "src/vaults/gscVault/getGSCStatus";
import { getVaultConfig } from "src/vaults/vaults";
import { useSigner } from "wagmi";

interface GSCVaultProfileCardProps {
  address: string;
  profileAddress: string;
}

export function GSCVaultProfileCard({
  address,
  profileAddress,
}: GSCVaultProfileCardProps): ReactElement {
  const { data } = useGSCVaultProfileCardData(address, profileAddress);

  // config
  const chainId = useChainId();
  const config = getVaultConfig(address, chainId);
  const name = config?.name || "GSC Vault";

  // kick transaction
  const { data: signer } = useSigner();
  const { mutate: kickGSCMember } = useKickGSCMember(address);

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
          value: formatBalance(requiredVotingPower),
        },
        {
          label: "Qualifying voting power",
          value: formatBalance(qualifyingVotingPower),
        },
      ]}
      button={{
        text: "Kick Member",
        disabled:
          !signer ||
          !gscStatus ||
          !getIsGSCMember(gscStatus) ||
          !isBelowThreshold,
        onClick: () =>
          signer &&
          kickGSCMember({
            memberAddress: profileAddress,
            signer,
          }),
      }}
    />
  );
}

function useGSCVaultProfileCardData(vaultAddress: string, userAddress: string) {
  const { coreVoting, gscVoting } = useCouncil();
  const { data: gscStatus } = useGSCStatus(userAddress);
  const queryEnabled = !!gscVoting;

  return useQuery({
    queryKey: ["gsc-vault-profile-card", { userAddress, vaultAddress }],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async () => {
          const qualifyingVotingPower = await coreVoting.getVotingPower(
            userAddress,
          );
          const requiredVotingPower = await gscVoting?.getRequiredVotingPower();
          const isBelowThreshold =
            +qualifyingVotingPower < +requiredVotingPower;

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
