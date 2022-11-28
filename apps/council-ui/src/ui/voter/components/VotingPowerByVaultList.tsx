import { Voter } from "@council/sdk";
import { getAddress } from "ethers/lib/utils";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useEnsName } from "wagmi";

interface VoterDataByVault {
  name: string;
  votingPower: string;
  balance?: string;
  numDelegated?: number;
  currentDelegate?: Voter;
}

interface VotingPowerByVaultProps {
  vaultData: VoterDataByVault[];
}

export function VotingPowerByVaultList({
  vaultData,
}: VotingPowerByVaultProps): ReactElement {
  return (
    <div className="flex h-96 flex-col gap-y-4 overflow-auto pr-3">
      {vaultData.map((vault) => {
        return (
          <div className="flex flex-col gap-y-2" key={vault.name}>
            <h3 className="text-xl font-bold underline">{vault.name}</h3>

            {vault.balance && (
              <div className="flex">
                <p>Tokens Deposited</p>
                <p className="ml-auto">{formatBalance(vault.balance)} ELFI</p>
              </div>
            )}

            <div className="flex">
              <p>Voting Power</p>
              <p className="ml-auto">{formatBalance(vault.votingPower)}</p>
            </div>

            {vault.currentDelegate && (
              <CurrentDelegateInfo delegate={vault.currentDelegate} />
            )}

            {!!vault.numDelegated && (
              <div className="flex">
                <p># of Delegators</p>
                <p className="ml-auto">{vault.numDelegated}</p>
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
  const { data: ens } = useEnsName({
    address: getAddress(delegate.address as string),
    enabled: !!delegate.address,
  });

  return (
    <div className="flex">
      <p>Current Delegate</p>
      <p className="ml-auto">{ens ?? formatAddress(delegate.address)}</p>
    </div>
  );
}
