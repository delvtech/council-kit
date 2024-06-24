import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { GscMembersTable } from "src/ui/vaults/gscVault/GscMembersTable";
import { GSCVaultsStatsRow } from "src/ui/vaults/gscVault/GscVaultStatsRow";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";

import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { getGscMembers, GscMemberInfo } from "src/utils/gscVault/getGscMembers";
import { getGscStatus } from "src/utils/gscVault/getGscStatus";
import { GscStatus } from "src/utils/gscVault/types";
import { PublicClient } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useJoinGsc } from "./hooks/useJoinGsc";
import { useReadGscVault } from "./hooks/useReadGscVault";

interface GscVaultDetailsProps {
  address: `0x${string}`;
}

export function GscVaultDetails({
  address: vaultAddress,
}: GscVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data, status, error } = useGscVaultDetails({
    vaultAddress,
    account,
  });
  const { joinGsc, status: joinGscStatus } = useJoinGsc();

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  if (status !== "success") {
    return <VaultDetailsSkeleton />;
  }

  return (
    <VaultDetails
      name={data.name}
      paragraphSummary={data.paragraphSummary}
      header={
        <VaultHeader name={data.name} descriptionURL={data.descriptionURL} />
      }
      statsRow={
        <GSCVaultsStatsRow
          accountMembership={data.gscStatus}
          membersCount={data.members.length}
          requiredVotingPower={data.requiredVotingPower}
          onJoin={joinGsc}
        />
      }
      actions={
        <div className="flex w-full flex-col  gap-8 sm:flex-row">
          <GscMembersTable
            members={data.members}
            requiredVotingPower={data.requiredVotingPower}
          />
        </div>
      }
    />
  );
}

interface GSCVaultDetailsData {
  gscStatus: GscStatus;
  paragraphSummary: string | undefined;
  descriptionURL: string | undefined;
  name: string | undefined;
  members: GscMemberInfo[];
  requiredVotingPower: bigint;
}

function useGscVaultDetails({
  vaultAddress,
  account,
}: {
  vaultAddress: `0x${string}`;
  account: `0x${string}` | undefined;
}): UseQueryResult<GSCVaultDetailsData> {
  const coreVoting = useReadCoreVoting();
  const config = useCouncilConfig();
  const vaultConfig = config.gscVoting?.vault;
  const gscVault = useReadGscVault();
  const publicClient = usePublicClient();

  const enabled = !!gscVault && !!vaultConfig;

  return useQuery({
    queryKey: ["gscLockingVaultDetails", vaultAddress, account],
    enabled,
    queryFn: enabled
      ? async (): Promise<GSCVaultDetailsData> => {
          const requiredVotingPower = await gscVault.getRequiredVotingPower();
          const members = await getGscMembers({
            client: publicClient as PublicClient,
            gscVault,
            approvedVaults: coreVoting.vaults,
          });

          const gscStatus = await getGscStatus({
            account,
            qualifyingVaults: coreVoting.vaults,
            gscVault,
          });

          return {
            gscStatus,
            descriptionURL: vaultConfig.descriptionURL,
            paragraphSummary: vaultConfig.paragraphSummary,
            name: vaultConfig.name,
            members,
            requiredVotingPower,
          };
        }
      : undefined,
  });
}
