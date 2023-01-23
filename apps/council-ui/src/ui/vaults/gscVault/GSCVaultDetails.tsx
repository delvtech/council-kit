import { GSCVault } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { VaultConfig, VotingContractConfig } from "src/config/CouncilConfig";
import { getActiveProposalCount } from "src/proposals/getActiveProposalCount";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import {
  GSCVaultStatsBar,
  GSCVaultStatsBarSkeleton,
} from "src/ui/vaults/gscVault/GSCVaultStatsBar";

import { VaultHeader, VaultHeaderSkeleton } from "src/ui/vaults/VaultHeader";
import { getGSCStatus, GSCStatus } from "src/vaults/gscVault";
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
          participants={data.participants}
        />
      ) : (
        <GSCVaultStatsBarSkeleton />
      )}

      <div className="flex flex-col w-full h-48 gap-8 sm:flex-row">
        {/* TODO: Forms and GSC Members table here */}
      </div>
    </>
  );
}

interface GSCVaultDetailsData {
  gscStatus: GSCStatus;
  activeProposalCount: number;
  descriptionURL: string | undefined;
  name: string | undefined;
  participants: number;
}

function useGSCVaultDetails({
  vaultAddress: gscVaultAddress,
  account,
}: {
  vaultAddress: string;
  account: string | undefined;
}): UseQueryResult<GSCVaultDetailsData> {
  const { context, coreVoting, gscVoting } = useCouncil();
  const chainId = useChainId();

  // safe to cast because this component should never be rendered unless it's
  // already known that there's a GSC Core Voting in the system.
  // See: pages/vaults/details.tsx
  const gscCoreVotingConfig = councilConfigs[chainId]
    .gscVoting as VotingContractConfig;
  const vaultConfig = gscCoreVotingConfig.vaults.find(
    (vault) => vault.address === gscVaultAddress,
  ) as VaultConfig;

  const queryEnabled = !!account && !!gscVoting;
  return useQuery({
    queryKey: ["gscLockingVaultDetails", gscVaultAddress, account],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<GSCVaultDetailsData> => {
          const gscVault = new GSCVault(gscVaultAddress, context);

          const activeProposalCount = await getActiveProposalCount(gscVoting);
          const participants = (await gscVault.getVoters()).length;
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
            participants,
          };
        }
      : undefined,
  });
}
