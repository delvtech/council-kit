import { Voter } from "@council/sdk";
import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import Link from "next/link";
import { ReactElement } from "react";
import { makeVaultURL, makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { VoterDataByVault } from "src/ui/voters/utils/getVoterDataByVault";
import { VotersListCompact } from "src/ui/voters/VotersListCompact";
import { useEnsName } from "wagmi";

interface VoterVaultsListProps {
  vaultData: VoterDataByVault[];
  address: string;
}

export function VoterVaultsList({
  address,
  vaultData,
}: VoterVaultsListProps): ReactElement {
  const { data: ens } = useEnsName({
    address: getAddress(address as string),
    enabled: !!address,
  });

  return (
    <div className="flex flex-wrap w-full gap-6">
      {vaultData.map((rowData) => {
        return (
          <div
            className="flex flex-col p-8 md:max-w-sm grow md:grow-0 gap-y-4 daisy-card bg-base-300 min-w-[360px]"
            key={rowData.vault.address}
          >
            <Link
              className="flex items-center hover:underline gap-x-2"
              href={makeVaultURL(rowData.vault.address)}
            >
              <WalletIcon address={rowData.vault.address} />

              <h3 className="text-2xl font-semibold">{rowData.vault.name}</h3>
            </Link>

            {rowData.balance && (
              <div className="flex items-center w-full">
                <p>Tokens Deposited</p>
                <p className="ml-auto font-bold">
                  {+rowData.balance
                    ? `${formatBalance(rowData.balance)} ELFI`
                    : "None"}
                </p>
              </div>
            )}

            <div className="flex items-center w-full">
              <p>Voting Power</p>
              <p className="ml-auto font-bold">
                {+rowData.votingPower
                  ? formatBalance(rowData.votingPower)
                  : "None"}
              </p>
            </div>

            {rowData.currentDelegate && (
              <CurrentDelegateInfo delegate={rowData.currentDelegate} />
            )}

            {!!rowData.numDelegated && rowData.numDelegated > 0 && (
              <div className="flex items-center w-full">
                <p># of Delegators</p>

                {/* The button to open modal */}
                <label
                  htmlFor={`delegator-modal-${rowData.vault.address}`}
                  className="ml-auto font-bold hover:underline hover:cursor-pointer text-secondary"
                >
                  {rowData.numDelegated}
                </label>

                <input
                  type="checkbox"
                  id={`delegator-modal-${rowData.vault.address}`}
                  className="daisy-modal-toggle"
                />
                <label
                  htmlFor={`delegator-modal-${rowData.vault.address}`}
                  className="cursor-pointer daisy-modal"
                >
                  <label
                    className="relative space-y-6 daisy-modal-box"
                    htmlFor={`delegator-modal-${rowData.vault.address}`}
                  >
                    {ens ? (
                      <h3 className="flex items-center text-xl font-bold">
                        Wallets delegated to
                        <WalletIcon className="mx-1 ml-2" address={address} />
                        {ens}:
                      </h3>
                    ) : (
                      <h3 className="text-lg font-bold">
                        Wallets delegated to {formatAddress(address)}
                      </h3>
                    )}

                    <div className="overflow-x-auto max-h-72">
                      {rowData.votersDelegated && (
                        <VotersListCompact voters={rowData.votersDelegated} />
                      )}
                    </div>
                  </label>
                </label>
              </div>
            )}

            <button
              className="w-full daisy-btn daisy-btn-primary"
              disabled={+rowData.votingPower <= 0}
            >
              Delegate
            </button>
          </div>
        );
      })}
    </div>
  );
}

interface CurrentDelegateInfoProps {
  delegate: Voter;
}

function CurrentDelegateInfo({
  delegate,
}: CurrentDelegateInfoProps): ReactElement {
  const name = useDisplayName(getAddress(delegate.address));
  const isDelegateZeroAddress =
    delegate.address === ethers.constants.AddressZero;

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
