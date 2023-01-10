import { Voter } from "@council/sdk";
import { getAddress } from "ethers/lib/utils";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { VoterDataByVault } from "src/ui/voters/hooks/useVoterDataByVault";

interface VoterVaultsListProps {
  vaultData: VoterDataByVault[];
}

export function VoterVaultsList({
  vaultData,
}: VoterVaultsListProps): ReactElement {
  return (
    <div className="flex gap-6 w-full flex-wrap">
      {vaultData.map((row) => {
        return (
          <div
            className="flex flex-col gap-y-2 daisy-card p-8 bg-base-300 min-w-[350px]"
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

  return (
    <div className="flex">
      <p>Current Delegate</p>
      <p className="ml-auto font-bold">{name}</p>
    </div>
  );
}
