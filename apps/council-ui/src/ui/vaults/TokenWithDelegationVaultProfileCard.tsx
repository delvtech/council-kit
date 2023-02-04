import { Voter } from "@council/sdk";
import classNames from "classnames";
import { constants } from "ethers";
import { getAddress } from "ethers/lib/utils";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVaultURL, makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { useDelegatesByVault } from "src/ui/vaults/hooks/useDelegatesByVault";
import { VotersListCompact } from "src/ui/voters/VotersListCompact";
import { useAccount } from "wagmi";

export interface TokenWithDelegationVaultProfileCardProps {
  vaultName: string;
  vaultAddress: string;
  userBalance?: string;
  userCurrentDelegate?: Voter;
  userVotersDelegated?: Voter[];
  userVotingPower: string;
  userAddress: string;
  userEns?: string;
  onDelegateChange: (delegateAddress: string) => void;
}

export function TokenWithDelegationVaultProfileCard({
  vaultName,
  vaultAddress,
  onDelegateChange,
  userVotingPower,
  userVotersDelegated,
  userAddress,
  userBalance,
  userCurrentDelegate,
  userEns,
}: TokenWithDelegationVaultProfileCardProps): ReactElement {
  const { isConnected, address: account } = useAccount();

  const { data: delegatesByVault } = useDelegatesByVault();
  const hasTokens = !!+(userBalance || "0");

  const isOwnProfileAndSelfDelegated =
    userAddress === account &&
    userCurrentDelegate &&
    userCurrentDelegate.address === account;

  const isProfileTheAccountDelegate =
    isOwnProfileAndSelfDelegated ||
    !!userVotersDelegated?.some(
      (voter) => voter.address === delegatesByVault?.[vaultAddress].address,
    );

  return (
    <div className="flex flex-col p-8 md:max-w-md grow md:grow-0 gap-y-4 daisy-card bg-base-200 min-w-[360px]">
      <Link
        className="flex items-center underline hover:no-underline gap-x-2"
        href={makeVaultURL(vaultAddress)}
      >
        <WalletIcon address={vaultAddress} />

        <h3 className="text-2xl font-semibold">{vaultName}</h3>
      </Link>

      {userBalance && (
        <div className="flex items-center w-full">
          <p>Tokens Deposited</p>
          <p className="ml-auto font-bold">
            {+userBalance ? `${formatBalance(userBalance)} ELFI` : "None"}
          </p>
        </div>
      )}

      <div className="flex items-center w-full">
        <p>Voting Power</p>
        <p className="ml-auto font-bold">
          {+userVotingPower ? formatBalance(userVotingPower) : "None"}
        </p>
      </div>

      {userCurrentDelegate && (
        <CurrentDelegateInfo delegate={userCurrentDelegate} />
      )}

      {userVotersDelegated && (
        <div className="flex items-center w-full">
          <p># of Delegators</p>

          {/* The button to open modal */}
          <label
            htmlFor={`delegator-modal-${vaultAddress}`}
            className={classNames("ml-auto font-bold ", {
              "underline hover:no-underline hover:cursor-pointer text-secondary":
                userVotersDelegated.length,
            })}
          >
            {userVotersDelegated.length}
          </label>

          {userVotersDelegated.length ? (
            <DelegatorListModal
              delegators={userVotersDelegated ?? []}
              vaultAddress={vaultAddress}
              voterAddress={userAddress}
              voterEns={userEns}
            />
          ) : null}
        </div>
      )}

      <button
        className="w-full daisy-btn"
        disabled={!isConnected || isProfileTheAccountDelegate || !hasTokens}
        onClick={() => onDelegateChange(userAddress)}
      >
        {getDelegateButtonLabel({
          isAccountDelegate: isProfileTheAccountDelegate,
          hasTokens,
        })}
      </button>
    </div>
  );
}

interface CurrentDelegateInfoProps {
  delegate: Voter;
}

function getDelegateButtonLabel({
  isAccountDelegate,
  hasTokens,
}: {
  isAccountDelegate: boolean;
  hasTokens: boolean;
}) {
  if (!hasTokens) {
    return "Nothing to delegate";
  }
  if (!isAccountDelegate) {
    return "Delegate";
  }
  return "Already delegated to this user";
}

function CurrentDelegateInfo({
  delegate,
}: CurrentDelegateInfoProps): ReactElement {
  const name = useDisplayName(getAddress(delegate.address));
  const isDelegateZeroAddress = delegate.address === constants.AddressZero;

  return (
    <div className="flex w-full gap-x-6">
      <p>Current Delegate</p>
      {isDelegateZeroAddress ? (
        <span className="ml-auto font-bold">None</span>
      ) : (
        <Link
          href={makeVoterURL(delegate.address)}
          className="flex items-center ml-auto font-bold hover:underline"
        >
          <WalletIcon className="mr-1" address={delegate.address} size={16} />
          {name}
        </Link>
      )}
    </div>
  );
}

interface DelegatorListModalProps {
  delegators: Voter[];
  vaultAddress: string;
  voterEns: string | undefined | null;
  voterAddress: string;
}

function DelegatorListModal({
  delegators,
  vaultAddress,
  voterAddress,
  voterEns,
}: DelegatorListModalProps) {
  return (
    <>
      <input
        type="checkbox"
        id={`delegator-modal-${vaultAddress}`}
        className="daisy-modal-toggle"
      />
      <label
        htmlFor={`delegator-modal-${vaultAddress}`}
        className="cursor-pointer daisy-modal"
      >
        <label
          className="relative space-y-6 daisy-modal-box"
          htmlFor={`delegator-modal-${vaultAddress}`}
        >
          {voterEns ? (
            <h3 className="flex items-center text-xl font-bold">
              Wallets delegated to
              <WalletIcon className="mx-1 ml-2" address={voterAddress} />
              {voterEns}:
            </h3>
          ) : (
            <h3 className="text-lg font-bold">
              Wallets delegated to {formatAddress(voterAddress)}
            </h3>
          )}

          <div className="overflow-x-auto max-h-72">
            <VotersListCompact voters={delegators} />
          </div>
        </label>
      </label>
    </>
  );
}
