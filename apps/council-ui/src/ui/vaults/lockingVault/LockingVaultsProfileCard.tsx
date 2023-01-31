import { ReactElement } from "react";
import { useChangeDelegate } from "src/ui/vaults/lockingVault/hooks/useChangeDelegate";
import {
  TokenWithDelegationVaultProfileCard,
  TokenWithDelegationVaultProfileCardProps,
} from "src/ui/vaults/TokenWithDelegationVaultProfileCard";
import { useSigner } from "wagmi";

type LockingVaultProfileCardProps = Omit<
  TokenWithDelegationVaultProfileCardProps,
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
    <TokenWithDelegationVaultProfileCard
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
          changeDelegate({
            signer,
            delegate: userAddress,
          });
        }
      }}
    />
  );
}
