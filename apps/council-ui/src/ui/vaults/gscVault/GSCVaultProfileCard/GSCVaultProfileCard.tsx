import { useQuery } from "@tanstack/react-query";
import { Signer } from "ethers";
import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { VaultConfig } from "src/config/CouncilConfig";
import { makeVaultURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { useCouncil } from "src/ui/council/useCouncil";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import { useKickGSCMember } from "src/ui/vaults/gscVault/useKickGSCMember";
import { getIsGSCMember } from "src/vaults/gscVault/getGSCStatus";
import { useAccount, useSigner } from "wagmi";

interface GSCVaultProfileCardProps {
  vaultConfig: VaultConfig;
  /** The address of the voter profile */
  voterAddress: string;
}

export function GSCVaultProfileCard({
  vaultConfig: { address, name },
  voterAddress,
}: GSCVaultProfileCardProps): ReactElement {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const { data } = useGSCVaultProfileCard(address, voterAddress);
  const { mutate: kickGSCMember } = useKickGSCMember(address);

  const isGSCMember = data?.voterGSCStatus
    ? getIsGSCMember(data?.voterGSCStatus)
    : false;

  const isKickButtonDisabled =
    !isConnected || !signer || !isGSCMember || !data?.isBelowThreshold;

  return (
    <div className="flex flex-col p-8 md:max-w-md grow md:grow-0 gap-y-4 daisy-card bg-base-200 min-w-[360px]">
      <Link
        className="flex items-center underline hover:no-underline gap-x-2"
        href={makeVaultURL(address)}
      >
        <WalletIcon address={address} />

        <h3 className="text-2xl font-semibold">{name}</h3>
      </Link>

      <div className="flex items-center w-full">
        <p>Membership status</p>
        <p className="ml-auto font-bold">
          {data ? data.voterGSCStatus : <Skeleton />}
        </p>
      </div>

      <div className="flex items-center w-full">
        <p>Required voting power</p>
        <p className="ml-auto font-bold">
          {data ? formatBalance(data.requiredVotingPower) : <Skeleton />}
        </p>
      </div>

      <div className="flex items-center w-full">
        <p>Qualifying voting power</p>
        <p className="ml-auto font-bold">
          {data ? formatBalance(data.qualifyingVotingPower) : <Skeleton />}
        </p>
      </div>

      <button
        className="w-full daisy-btn"
        disabled={isKickButtonDisabled}
        onClick={() =>
          kickGSCMember({
            memberAddress: voterAddress,
            signer: signer as Signer, // safe to cast because button is disabled when signer is undefined
          })
        }
      >
        Kick member
      </button>
    </div>
  );
}

function useGSCVaultProfileCard(vaultAddress: string, userAddress: string) {
  const { coreVoting, gscVoting } = useCouncil();
  const { data: voterGSCStatus } = useGSCStatus(userAddress);
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
            voterGSCStatus,
          };
        }
      : undefined,
  });
}
