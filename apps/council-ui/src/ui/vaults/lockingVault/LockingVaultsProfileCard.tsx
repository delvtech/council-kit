import { ReactElement } from "react";
import {
  GenericVaultProfileCard,
  GenericVaultProfileCardProps,
} from "src/ui/vaults/GenericVaultProfileCard";
import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
import { useSigner } from "wagmi";

type LockingVaultProfileCardProps = Omit<
  GenericVaultProfileCardProps,
  "vaultName" | "onDelegateChange"
>;

export function LockingVaultProfileCard({
  vaultAddress,
  userAddress,
  userVotingPower,
  userCurrentDelegate,
  userBalance,
  userVotersDelegated,
  userEns,
}: LockingVaultProfileCardProps): ReactElement {
  const { mutate: changeDelegate } = useChangeDelegate(vaultAddress);
  const { data: signer } = useSigner();

  return (
    <GenericVaultProfileCard
      vaultName="Locking Vault"
      vaultAddress={vaultAddress}
      userVotingPower={userVotingPower}
      userAddress={userAddress}
      userBalance={userBalance}
      userCurrentDelegate={userCurrentDelegate}
      userVotersDelegated={userVotersDelegated}
      userEns={userEns}
      onDelegateChange={async () => {
        if (signer) {
          await changeDelegate({
            signer,
            delegate: userAddress,
          });
        }
      }}
    />
  );
}
