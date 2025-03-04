import { Address } from "@delvtech/drift";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { getCouncilConfig } from "src/config/utils/getCouncilConfig";
import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";
import { GscMembersTable } from "src/ui/vaults/gscVault/GscMembersTable";
import { GSCVaultsStatsRow } from "src/ui/vaults/gscVault/GscVaultStatsRow";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { getBulkEnsRecords } from "src/utils/getBulkEnsRecords";
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

interface GscMemberInfo {
  member: Address;
  qualifyingVotingPower: bigint;
  ensName: string | undefined;
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
  const config = getCouncilConfig(chainId);
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
          const qualifyingVaults = config.coreVoting.vaults.map(({ address }) =>
            council.votingVault(address),
          );

          const [members, requiredVotingPower, gscStatus] = await Promise.all([
            gscVault.getMembers(),
            gscVault.getRequiredVotingPower(),
            getGscStatus({ account, chainId }),
            ,
          ]);

          const [memberENSNames, ...memberVotingPowers] = await Promise.all([
            getBulkEnsRecords(members, chainId),
            ...members
              .map((member) =>
                qualifyingVaults.map(async (vault) => {
                  const votingPower = await vault.getVotingPower({
                    voter: member,
                  });
                  return { member, votingPower };
                }),
              )
              .flat(),
          ]);

          const memberInfoMap: Record<Address, GscMemberInfo> = {};
          for (const { member, votingPower } of memberVotingPowers) {
            memberInfoMap[member] ||= {
              member,
              ensName: memberENSNames[member],
              qualifyingVotingPower: 0n,
            };
            memberInfoMap[member].qualifyingVotingPower += votingPower;
          }

          return {
            name: vaultConfig.name,
            descriptionURL: vaultConfig.descriptionURL,
            paragraphSummary: vaultConfig.paragraphSummary,
            members: Object.values(memberInfoMap),
            requiredVotingPower,
            gscStatus,
          };
        }
      : undefined,
  });
}
