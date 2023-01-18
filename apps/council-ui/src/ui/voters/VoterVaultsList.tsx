import { Voter } from "@council/sdk";
import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { VoterDataByVault } from "src/ui/voters/utils/getVoterDataByVault";

interface VoterVaultsListProps {
  vaultData: VoterDataByVault[];
}

export function VoterVaultsList({
  vaultData,
}: VoterVaultsListProps): ReactElement {
  return (
    <div className="flex flex-wrap w-full gap-6">
      {vaultData.map((row) => {
        return (
          <div
            className="flex flex-col p-8 grow md:grow-0 gap-y-2 daisy-card bg-base-300"
            key={row.vault.address}
          >
            <h3 className="text-2xl font-semibold underline">
              {row.vault.name}
            </h3>

            {row.balance && (
              <div className="flex">
                <p>Tokens Deposited</p>
                <p className="ml-auto font-bold">
                  {formatBalance(row.balance)} ELFI
                </p>
              </div>
            )}

            <div className="flex">
              <p>Voting Power</p>
              <p className="ml-auto font-bold">
                {formatBalance(row.votingPower)}
              </p>
            </div>

            {row.currentDelegate && (
              <CurrentDelegateInfo delegate={row.currentDelegate} />
            )}

            {!!row.numDelegated && (
              <div className="flex">
                <p># of Delegators</p>
                <p className="ml-auto font-bold">{row.numDelegated}</p>
              </div>
            )}
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
    <div className="flex gap-x-6">
      <p>Current Delegate</p>
      {isDelegateZeroAddress ? (
        <span className="font-bold">None</span>
      ) : (
        <p className="flex items-center ml-auto font-bold">
          <WalletIcon className="mr-1" address={delegate.address} size={16} />
          {name}
        </p>
      )}
    </div>
  );
}

// ================ Skeletons ================

export function VoterVaultsListSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap w-full gap-6">
      <div className="flex flex-col grow p-8 md:grow-0 gap-y-2 daisy-card bg-base-300 w-[300px]">
        <h3 className="text-2xl font-semibold underline">
          <Skeleton />
        </h3>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>
      </div>

      <div className="flex flex-col grow p-8 md:grow-0 gap-y-2 daisy-card bg-base-300 w-[300px]">
        <h3 className="text-2xl font-semibold underline">
          <Skeleton />
        </h3>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>

        <p className="w-full">
          <Skeleton />
        </p>
      </div>
    </div>
  );
}
