import { VoterPowerBreakdown } from "@delvtech/council-viem";
import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVoterURL } from "src/routes";
import { Tooltip } from "src/ui/base/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { formatUnitsBalance } from "src/ui/base/formatting/formatUnitsBalance";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { useVaultConfig } from "src/ui/config/hooks/useVaultConfig";
import { useReadCouncil } from "src/ui/council/hooks/useReadCouncil";
import { DelegatorListModal } from "src/ui/vaults/DelegatorListModal";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
import { useReadGscVault } from "src/ui/vaults/gscVault/hooks/useReadGscVault";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import { useDelegate } from "src/ui/vaults/vestingVault/hooks/useDelegate";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";

interface VestingVaultProfileCardProps {
  address: `0x${string}`;
  profileAddress: `0x${string}`;
}

export function VestingVaultProfileCard({
  address,
  profileAddress,
}: VestingVaultProfileCardProps): ReactElement {
  // data
  const { data } = useVestingVaultProfileCardData(address, profileAddress);
  const profileName = useDisplayName(profileAddress);
  const delegateName = useDisplayName(data?.delegate.address);
  const { address: account } = useAccount();
  const { delegate: accountDelegate } = useDelegate({
    vault: address,
    account,
  });

  // config
  const config = useVaultConfig(address);
  const name = config?.name || "Vesting Vault";

  // delegate transaction
  const { changeDelegate } = useChangeDelegate();

  if (!data) {
    return <VaultProfileCardSkeleton address={address} name={name} />;
  }

  const {
    grantSize,
    decimals,
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
          value: grantSize
            ? `${formatUnitsBalance({ balance: grantSize, decimals })} ${tokenSymbol}`
            : "None",
        },
        {
          label: "Voting Power",
          value:
            votingPowerBreakdown && votingPowerBreakdown.votingPower
              ? formatVotingPower(votingPowerBreakdown.votingPower)
              : "None",
        },
        {
          label: "Current Delegate",
          value:
            delegate.address === zeroAddress ? (
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
                    <BuildingLibraryIcon className="ml-1 size-5 fill-warning" />
                  </Tooltip>
                )}
              </Link>
            ),
        },
        {
          label: "# of Delegators",
          value: votingPowerBreakdown?.votingPowerByDelegator.length ? (
            <>
              <label
                htmlFor={`delegator-modal-${address}`}
                className="text-secondary underline hover:cursor-pointer hover:no-underline"
              >
                {votingPowerBreakdown.votingPowerByDelegator.length}
              </label>
              <DelegatorListModal
                id={`delegator-modal-${address}`}
                delegators={votingPowerBreakdown.votingPowerByDelegator}
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
        disabled:
          !changeDelegate || accountDelegate?.address === profileAddress,
        onClick: () =>
          changeDelegate!({
            vaultAddress: address,
            newDelegate: profileAddress,
          }),
      }}
    />
  );
}

function useVestingVaultProfileCardData(
  address: `0x${string}`,
  profileAddress: `0x${string}`,
) {
  const council = useReadCouncil();
  const gscVault = useReadGscVault();
  return useQuery({
    queryKey: ["vesting-vault-profile-card", address, profileAddress],
    queryFn: async () => {
      const vestingVault = council.vestingVault(address);
      const votingPowerBreakdowns = await vestingVault.getVotingPowerBreakdown({
        account: profileAddress,
      });

      // FIXME: This isn't properly typed. evm-client isn't deriving the
      // component types correctly.
      const grant = await vestingVault.getGrant({ account: profileAddress });
      const token = await vestingVault.getToken();
      const delegate = await vestingVault.getDelegate({
        account: profileAddress,
      });

      grant;

      return {
        grantSize: grant.allocation,
        decimals: await token.getDecimals(),
        tokenSymbol: await token.getSymbol(),
        votingPowerBreakdown: votingPowerBreakdowns[0] as
          | VoterPowerBreakdown
          | undefined,
        delegate,
        delegateIsGSCMember:
          gscVault &&
          (await gscVault.getIsMember({ account: delegate.address })),
      };
    },
  });
}
