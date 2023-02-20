import { useQuery } from "@tanstack/react-query";
import { getAddress } from "ethers/lib/utils";
import { ReactElement } from "react";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { GSCVaultProfileCard } from "src/ui/vaults/gscVault/GSCVaultProfileCard/GSCVaultProfileCard";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import { VaultProfileCard } from "src/ui/vaults/VaultProfileCard";
import { VoterDataByTokenWithDelegationVault } from "src/vaults/getVoterDataByTokenWithDelegationVault";
import { getIsGSCMember } from "src/vaults/gscVault/getGSCStatus";
import { getGSCCoreVotingVaults } from "src/vaults/vaults";
import { useEnsName } from "wagmi";

interface VoterVaultsListProps {
  vaultsData: VoterDataByTokenWithDelegationVault[];
  address: string;
}

export function VoterVaultsList({
  address,
  vaultsData,
}: VoterVaultsListProps): ReactElement {
  const chainId = useChainId();
  const { data: ens } = useEnsName({
    address: getAddress(address as string),
    enabled: !!address,
  });

  const { data: voterVaultsListData } = useVoterVaultsListData(address);

  const { data: gscVaultMembershipStatus } = useGSCStatus(address);
  const [gscVaultConfig] = getGSCCoreVotingVaults(chainId);
  const showGSCVaultProfileCard =
    gscVaultConfig &&
    gscVaultMembershipStatus &&
    getIsGSCMember(gscVaultMembershipStatus) &&
    voterVaultsListData &&
    +(voterVaultsListData.qualifyingVotingPowerForGSC || "0");

  return (
    <div className="grid grid-cols-3 grid-flow-row w-full gap-6">
      {/* core voting vaults */}
      {vaultsData.map((voterData) => {
        return (
          <VaultProfileCard
            key={voterData.vault.address}
            vaultAddress={voterData.vault.address}
            voterAddress={address}
            voterData={voterData}
            voterEns={ens?.toString()}
          />
        );
      })}

      {/* gsc vault */}
      {showGSCVaultProfileCard ? (
        <GSCVaultProfileCard
          voterAddress={address}
          vaultConfig={gscVaultConfig}
        />
      ) : null}
    </div>
  );
}
function useVoterVaultsListData(address: string) {
  const { coreVoting } = useCouncil();
  return useQuery({
    queryKey: ["voter-profile-card", address],
    queryFn: async () => {
      const qualifyingVotingPowerForGSC = await coreVoting.getVotingPower(
        address,
      );
      return {
        qualifyingVotingPowerForGSC,
      };
    },
  });
}
