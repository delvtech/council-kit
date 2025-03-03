import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { GscMembersTable } from "src/ui/vaults/gscVault/GscMembersTable";
import { GSCVaultsStatsRow } from "src/ui/vaults/gscVault/GscVaultStatsRow";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";

import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { getBulkEnsRecords } from "src/utils/getBulkEnsRecords";
import { GscMemberInfo } from "src/utils/gsc/getGscMembers";
import { getGscStatus } from "src/utils/gsc/getGscStatus";
import { GscStatus } from "src/utils/gsc/types";
import { useAccount } from "wagmi";
import { useJoinGsc } from "./hooks/useJoinGsc";

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
        <div className="flex w-full flex-col gap-8 sm:flex-row">
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
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const vaultConfig = getVaultConfig({
    address: vaultAddress,
    chainId,
  });

  const enabled = !!council && !!vaultConfig;

  return useQuery({
    queryKey: ["useGscVaultDetails", chainId, vaultAddress, account],
    enabled,
    queryFn: enabled
      ? async (): Promise<GSCVaultDetailsData> => {
          const gscVault = council?.gscVault(vaultAddress);
          const [requiredVotingPower, members, gscStatus] = await Promise.all([
            gscVault.getRequiredVotingPower(),
            gscVault.getMembers(),
            getGscStatus({ account, chainId }),
          ]);

          const memberENSNames = await getBulkEnsRecords(members, chainId);

          return {
            gscStatus,
            descriptionURL: vaultConfig.descriptionURL,
            paragraphSummary: vaultConfig.paragraphSummary,
            name: vaultConfig.name,
            members: members.map((member, index) => ({
              ensName: memberENSNames[member] || undefined,
              member,
              qualifyingVotingPower: 0n,
            })),
            requiredVotingPower,
          };
        }
      : undefined,
  });
}
