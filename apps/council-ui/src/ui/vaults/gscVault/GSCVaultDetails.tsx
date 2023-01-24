import { GSCVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { VaultConfig, VotingContractConfig } from "src/config/CouncilConfig";
import { getActiveProposalCount } from "src/proposals/getActiveProposalCount";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { GSCMembersTable } from "src/ui/vaults/gscVault/GSCMembersTable/GSCMembersTable";
import { GSCMembersTableSkeleton } from "src/ui/vaults/gscVault/GSCMembersTable/GSCMembersTableSkeleton";
import { GSCVaultStatsBar } from "src/ui/vaults/gscVault/GSCVaultStatsBar/GSCVaultStatsBar";
import { GSCVaultStatsBarSkeleton } from "src/ui/vaults/gscVault/GSCVaultStatsBar/GSCVaultStatsBarSkeleton";

import { VaultHeader, VaultHeaderSkeleton } from "src/ui/vaults/VaultHeader";
import {
  getGSCMembers,
  getGSCStatus,
  GSCMemberInfo,
  GSCStatus,
} from "src/vaults/gscVault";
import { useAccount } from "wagmi";

interface GSCVaultDetailsProps {
  vaultAddress: string;
}

export function GSCVaultDetails({
  vaultAddress: vaultAddress,
}: GSCVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data, status, error } = useGSCVaultDetails({
    vaultAddress,
    account,
  });

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      {status === "success" ? (
        <VaultHeader name={data.name} descriptionURL={data.descriptionURL} />
      ) : (
        <VaultHeaderSkeleton />
      )}

      {status === "success" ? (
        <GSCVaultStatsBar
          accountMembership={data.gscStatus}
          activeProposalCount={data.activeProposalCount}
          membersCount={data.members.length}
        />
      ) : (
        <GSCVaultStatsBarSkeleton />
      )}

      <div className="flex flex-col w-full gap-8 sm:flex-row">
        {status === "success" ? (
          <GSCMembersTable members={data.members} />
        ) : (
          <GSCMembersTableSkeleton />
        )}
      </div>
    </>
  );
}

interface GSCVaultDetailsData {
  gscStatus: GSCStatus;
  activeProposalCount: number;
  descriptionURL: string | undefined;
  name: string | undefined;
  members: GSCMemberInfo[];
}

function useGSCVaultDetails({
  vaultAddress,
  account,
}: {
  vaultAddress: string;
  account: string | undefined;
}): UseQueryResult<GSCVaultDetailsData> {
  const { context, coreVoting, gscVoting } = useCouncil();
  const chainId = useChainId();

  const coreVotingConfig = councilConfigs[chainId].coreVoting;
  // safe to cast because this component should never be rendered unless it's
  // already known that there's a GSC Core Voting in the system.
  // See: pages/vaults/details.tsx
  const gscCoreVotingConfig = councilConfigs[chainId]
    .gscVoting as VotingContractConfig;
  const vaultConfig = gscCoreVotingConfig.vaults.find(
    (vault) => vault.address === vaultAddress,
  ) as VaultConfig;

  const queryEnabled = !!account && !!gscVoting;
  return useQuery({
    queryKey: ["gscLockingVaultDetails", vaultAddress, account],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<GSCVaultDetailsData> => {
          const gscVault = new GSCVault(vaultAddress, context);

          const activeProposalCount = await getActiveProposalCount(gscVoting);
          const members = await getGSCMembers(
            gscVault,
            coreVotingConfig.vaults.map((vault) => vault.address),
            context.provider,
          );

          const gscStatus = await getGSCStatus({
            coreVoting,
            gscVoting,
            address: account,
          });

          return {
            gscStatus,
            descriptionURL: vaultConfig.descriptionURL,
            name: vaultConfig.name,
            activeProposalCount,
            members,
          };
        }
      : undefined,
  });
}
