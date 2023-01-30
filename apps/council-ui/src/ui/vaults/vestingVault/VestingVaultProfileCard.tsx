import { ReactElement } from "react";
import {
  GenericVaultProfileCard,
  GenericVaultProfileCardProps,
} from "src/ui/vaults/GenericVaultProfileCard";
import { useChangeDelegate } from "src/ui/vaults/vestingVault/hooks/useChangeDelegate";
import { useSigner } from "wagmi";

type VestingVaultProfileCardProps = Omit<
  GenericVaultProfileCardProps,
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
    <GenericVaultProfileCard
      vaultName="Vesting Vault"
      vaultAddress={vaultAddress}
      userVotingPower={userVotingPower}
      userAddress={userAddress}
      userBalance={userBalance}
      userCurrentDelegate={userCurrentDelegate}
      userVotersDelegated={userVotersDelegated}
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
