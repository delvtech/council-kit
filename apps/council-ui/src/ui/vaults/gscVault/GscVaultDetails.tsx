import { Address } from "@delvtech/drift";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";
import { getVaultConfig } from "src/config/utils/getVaultConfig";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import {
  GscMemberInfo,
  GscMembersTable,
} from "src/ui/vaults/gscVault/GscMembersTable";
import { GSCVaultsStatsRow } from "src/ui/vaults/gscVault/GscVaultStatsRow";
import { VaultDetails } from "src/ui/vaults/VaultDetails/VaultDetails";
import { VaultDetailsSkeleton } from "src/ui/vaults/VaultDetails/VaultDetailsSkeleton";
import { VaultHeader } from "src/ui/vaults/VaultHeader";
import { getBulkEnsRecords } from "src/utils/getBulkEnsRecords";
import { getVotingPower } from "src/utils/vaults/getVotingPower";
import { getGscStatus } from "src/utils/vaults/gsc/getGscStatus";
import { GscStatus } from "src/utils/vaults/gsc/types";
import { useAccount } from "wagmi";

interface GscVaultDetailsProps {
  address: `0x${string}`;
}

export function GscVaultDetails({
  address,
}: GscVaultDetailsProps): ReactElement {
  const { address: account } = useAccount();
  const { data, status, error } = useGscVaultDetailsData({
    vaultAddress: address,
    account,
  });
  const chainId = useSupportedChainId();
  const vaultConfig = getVaultConfig({ address, chainId });
  const name = vaultConfig?.name || "Vesing Vault";

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  if (status !== "success") {
    return <VaultDetailsSkeleton />;
  }

  return (
    <VaultDetails
      name={name}
      paragraphSummary={vaultConfig?.paragraphSummary}
      header={
        <VaultHeader name={name} descriptionURL={vaultConfig?.descriptionURL} />
      }
      statsRow={
        <GSCVaultsStatsRow
          accountMembership={data.gscStatus}
          membersCount={data.members.length}
          requiredVotingPower={data.requiredVotingPower}
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
  members: GscMemberInfo[];
  requiredVotingPower: bigint;
}

function useGscVaultDetailsData({
  vaultAddress,
  account,
}: {
  vaultAddress: `0x${string}`;
  account: `0x${string}` | undefined;
}): UseQueryResult<GSCVaultDetailsData> {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const config = useCouncilConfig();
  const enabled = !!council;

  return useQuery({
    queryKey: ["useGscVaultDetails", chainId, vaultAddress, account],
    enabled,
    queryFn: enabled
      ? async (): Promise<GSCVaultDetailsData> => {
          const gscVault = council?.gscVault(vaultAddress);

          const [members, requiredVotingPower, gscStatus] = await Promise.all([
            gscVault.getMembers(),
            gscVault.getRequiredVotingPower(),
            getGscStatus({ account, chainId }),
            ,
          ]);

          const memberVaults = await Promise.all(
            members.map(async (member) => {
              const qualifyingVaults = await gscVault.getMemberVaults(member);
              return { member, qualifyingVaults };
            }),
          );

          const [memberENSNames, ...memberVotingPowers] = await Promise.all([
            getBulkEnsRecords(members, chainId),
            ...memberVaults
              .map(({ member, qualifyingVaults }) =>
                qualifyingVaults.map(async (vault) => {
                  const votingPower = await getVotingPower({
                    chainId,
                    vault: vault.address,
                    voter: member,
                  });
                  return { member, votingPower };
                }),
              )
              .flat(),
          ]);

          const memberInfoByAddress: Record<Address, GscMemberInfo> = {};
          for (const { member, votingPower } of memberVotingPowers) {
            memberInfoByAddress[member] ||= {
              member,
              ensName: memberENSNames[member],
              qualifyingVotingPower: 0n,
            };
            memberInfoByAddress[member].qualifyingVotingPower += votingPower;
          }

          return {
            members: Object.values(memberInfoByAddress),
            requiredVotingPower,
            gscStatus,
          };
        }
      : undefined,
  });
}
