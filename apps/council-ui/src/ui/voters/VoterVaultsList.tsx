import { ReactElement } from "react";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VoterDataByVault } from "src/vaults/getVoterDataByVault";

interface VoterVaultsListProps {
  vaultsData: VoterDataByVault[];
  address: string;
}

export function VoterVaultsList({
  address,
  vaultsData,
}: VoterVaultsListProps): ReactElement {
  // const { data: ens } = useEnsName({
  //   address: getAddress(address as string),
  //   enabled: !!address,
  // });

  return (
    <div className="flex flex-wrap w-full gap-6">
      {vaultsData.map((voterData) => {
        return (
          <VaultProfileCard
            key={voterData.vault.address}
            vaultAddress={voterData.vault.address}
            voterAddress={address}
            voterData={voterData}
          />
        );
      })}
    </div>
  );
}
