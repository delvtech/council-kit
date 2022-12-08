import { Voter } from "@council/sdk";
import { getAddress } from "ethers/lib/utils";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { VoterDataByVault } from "src/ui/voter/hooks/useVoterDataByVault";

interface VotingPowerByVaultProps {
  vaultData: VoterDataByVault[];
}

export function VotingPowerByVaultList({
  vaultData,
}: VotingPowerByVaultProps): ReactElement {
  return (
    <div className="flex h-96 flex-col gap-y-4 overflow-auto pr-3">
      {vaultData.map((row) => {
        return (
          <div className="flex flex-col gap-y-2" key={row.vault.address}>
            <h3 className="text-xl font-semibold underline">
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
