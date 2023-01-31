import { ReactElement } from "react";
import {
  TokenWithDelegationVaultProfileCard,
  TokenWithDelegationVaultProfileCardProps,
} from "src/ui/vaults/TokenWithDelegationVaultProfileCard";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import { useSigner } from "wagmi";

type VestingVaultProfileCardProps = Omit<
  TokenWithDelegationVaultProfileCardProps,
  "vaultName" | "onDelegateChange"
>;

export function VestingVaultProfileCard({
  vaultAddress,
  userAddress,
  userVotingPower,
  userCurrentDelegate,
  userBalance,
  userVotersDelegated,
}: VestingVaultProfileCardProps): ReactElement {
  const { mutate: changeDelegate } = useChangeDelegate(vaultAddress);
  const { data: signer } = useSigner();

  return (
    <TokenWithDelegationVaultProfileCard
      vaultName="Vesting Vault"
      vaultAddress={vaultAddress}
      userVotingPower={userVotingPower}
      userAddress={userAddress}
      userBalance={userBalance}
      userCurrentDelegate={userCurrentDelegate}
      userVotersDelegated={userVotersDelegated}
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
