import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ReactElement } from "react";
import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { makeVoterURL } from "src/routes";
import { Tooltip } from "src/ui/base/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { formatUnitsBalance } from "src/ui/base/formatting/formatUnitsBalance";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { DelegatorListModal } from "src/ui/vaults/DelegatorListModal";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VaultProfileCardSkeleton } from "src/ui/vaults/VaultProfileCardSkeleton";
import { useReadGscVault } from "src/ui/vaults/gscVault/hooks/useReadGscVault";
import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
import { useDelegate } from "src/ui/vaults/lockingVault/hooks/useDelegate";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";

interface LockingVaultProfileCardProps {
  address: `0x${string}`;
  profileAddress: `0x${string}`;
}

export function LockingVaultProfileCard({
  address,
  profileAddress,
}: LockingVaultProfileCardProps): ReactElement {
  const { data } = useLockingVaultProfileCardData(address, profileAddress);
  const profileName = useDisplayName(profileAddress);
  const delegateName = useDisplayName(data?.delegate);
  const chainId = useSupportedChainId();
  const config = getVaultConfig({ address, chainId });
  const name = config?.name || "Locking Vault";

  const { address: account } = useAccount();
  const { data: accountDelegate } = useDelegate({
    voter: account,
    vault: address,
  });

  const { write: changeDelegate } = useChangeDelegate();

  if (!data) {
    return <VaultProfileCardSkeleton address={address} name={name} />;
  }

  const {
    balance,
    tokenSymbol,
    votingPowerBreakdown,
    delegate,
    delegateIsGscMember: delegateIsGSCMember,
    decimals,
  } = data || {};

  return (
    <VaultProfileCard
      address={address}
      name={name}
      stats={[
        {
          label: "Tokens Deposited",
          value: balance
            ? `${formatUnitsBalance({
                balance,
                decimals,
              })} ${tokenSymbol}`
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
            delegate === zeroAddress ? (
              "None"
            ) : (
              <Link
                href={makeVoterURL(delegate)}
                className="flex items-center hover:underline"
              >
                <WalletIcon className="mr-1" address={delegate} size={16} />
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
          value: votingPowerBreakdown?.delegators.length ? (
            <>
              <label
                htmlFor={`delegator-modal-${address}`}
                className="text-secondary underline hover:cursor-pointer hover:no-underline"
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
        disabled: !changeDelegate || accountDelegate === profileAddress,
        onClick: () =>
          changeDelegate!({
            vaultAddress: address,
            newDelegate: profileAddress,
          }),
      }}
    />
  );
}

function useLockingVaultProfileCardData(
  address: `0x${string}`,
  profileAddress: `0x${string}`,
) {
  const council = useReadCouncil();
  const gscVault = useReadGscVault();
  const enabled = !!council;

  return useQuery({
    queryKey: ["locking-vault-profile-card", address, profileAddress],
    enabled,
    queryFn: enabled
      ? async () => {
          const lockingVault = council.lockingVault(address);

          const [token, balance, delegate, [votingPowerBreakdown]] =
            await Promise.all([
              lockingVault.getToken(),
              lockingVault.getBalanceOf(profileAddress),
              lockingVault.getDelegate(profileAddress),
              lockingVault.getVotingPowerBreakdown({
                voter: profileAddress,
              }),
            ]);

          const [decimals, tokenSymbol, delegateIsGscMember] =
            await Promise.all([
              token.getDecimals(),
              token.getSymbol(),
              gscVault?.getIsMember(delegate),
            ]);

          return {
            balance,
            decimals,
            tokenSymbol,
            votingPowerBreakdown,
            delegate,
            delegateIsGscMember,
          };
        }
      : undefined,
  });
}
