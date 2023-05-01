import { VestingVault, VoterPowerBreakdown } from "@council/sdk";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { constants } from "ethers";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { DelegatorListModal } from "src/ui/vaults/DelegatorListModal";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import { useDelegate } from "src/ui/vaults/vestingVault/hooks/useDelegate";
import { getVaultConfig } from "src/vaults/vaults";
import { useSigner } from "wagmi";

interface VestingVaultProfileCardProps {
  address: string;
  profileAddress: string;
}

export function VestingVaultProfileCard({
  address,
  profileAddress,
}: VestingVaultProfileCardProps): ReactElement {
  // data
  const { data } = useVestingVaultProfileCardData(address, profileAddress);
  const profileName = useDisplayName(profileAddress);
  const delegateName = useDisplayName(data?.delegate.address);
  const { data: accountDelegate } = useDelegate(address);

  // config
  const chainId = useChainId();
  const config = getVaultConfig(address, chainId);
  const name = config?.name || "Vesting Vault";

  // delegate transaction
  const { data: signer } = useSigner();
  const { mutate: changeDelegate } = useChangeDelegate(address);

  if (!data) {
    return <VaultProfileCardSkeleton address={address} name={name} />;
  }

  const {
    grantSize,
    tokenSymbol,
    votingPowerBreakdown,
    delegate,
    delegateIsGSCMember,
  } = data || {};

  return (
    <VaultProfileCard
      address={address}
      name={name}
      stats={[
        {
          label: "Grant Size",
          value: +grantSize
            ? `${formatBalance(grantSize)} ${tokenSymbol}`
            : "None",
        },
        {
          label: "Voting Power",
          value:
            votingPowerBreakdown && +votingPowerBreakdown.votingPower
              ? formatBalance(votingPowerBreakdown.votingPower)
              : "None",
        },
        {
          label: "Current Delegate",
          value:
            delegate.address === constants.AddressZero ? (
              "None"
            ) : (
              <Link
                href={makeVoterURL(delegate.address)}
                className="flex items-center hover:underline"
              >
                <WalletIcon
                  className="mr-1"
                  address={delegate.address}
                  size={16}
                />
                {delegateName}
                {delegateIsGSCMember && (
                  <Tooltip content="GSC Member">
                    <BuildingLibraryIcon className="w-5 h-5 ml-1 fill-warning" />
                  </Tooltip>
                )}
              </Link>
            ),
        },
        {
          label: "# of Delegators",
          value: votingPowerBreakdown?.delegators.length ? (
            <>
              <label
                htmlFor={`delegator-modal-${address}`}
                className="underline hover:no-underline hover:cursor-pointer text-secondary"
              >
                {votingPowerBreakdown.delegators.length}
              </label>
              <DelegatorListModal
                id={`delegator-modal-${address}`}
                delegators={votingPowerBreakdown.delegators}
                delegateAddress={profileAddress}
                delegateName={profileName}
              />
            </>
          ) : (
            "None"
          ),
        },
      ]}
      button={{
        text: "Delegate",
        disabled: !signer || accountDelegate?.address === profileAddress,
        onClick: () =>
          signer && changeDelegate({ delegate: profileAddress, signer }),
      }}
    />
  );
}

function useVestingVaultProfileCardData(
  address: string,
  profileAddress: string,
) {
  const { context, gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["vesting-vault-profile-card", address, profileAddress],
    queryFn: async () => {
      const vestingVault = new VestingVault(address, context);
      const votingPowerBreakdowns = await vestingVault.getVotingPowerBreakdown(
        profileAddress,
      );

      const grant = await vestingVault.getGrant(profileAddress);
      const token = await vestingVault.getToken();
      const delegate = await vestingVault.getDelegate(profileAddress);

      return {
        grantSize: grant.allocation,
        tokenSymbol: await token.getSymbol(),
        votingPowerBreakdown: votingPowerBreakdowns[0] as
          | VoterPowerBreakdown
          | undefined,
        delegate,
        delegateIsGSCMember:
          gscVoting && (await gscVoting.getIsMember(delegate.address)),
      };
    },
  });
}
