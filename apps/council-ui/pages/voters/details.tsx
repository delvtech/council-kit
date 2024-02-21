import { ReadVote, ReadVotingVault } from "@delvtech/council-viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Routes } from "src/routes";
import { Breadcrumbs } from "src/ui/base/Breadcrumbs";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Page } from "src/ui/base/Page";
import { asyncFilter } from "src/ui/base/utils/asyncFilter";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { AddressWithEtherscan } from "src/ui/ens/AdddressWithEtherscan";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useGscStatus } from "src/ui/vaults/gscVault/hooks/useGscStatus";
import { VoterStatsRowSkeleton } from "src/ui/voters/skeletons/VoterStatsRowSkeleton";
import { VoterStatsRow } from "src/ui/voters/VoterStatsRow";
import { VoterVaultsList } from "src/ui/voters/VoterVaultsList";
import { VoterVaultsListSkeleton } from "src/ui/voters/VoterVaultsListSkeleton";
import { VotingHistoryTableSkeleton } from "src/ui/voters/VotingHistorySkeleton";
import { VotingHistoryTable } from "src/ui/voters/VotingHistoryTable";
import { makeEtherscanAddressURL } from "src/utils/etherscan/makeEtherscanAddressURL";
import { GscStatus } from "src/utils/gscVault/types";
import { getAddress } from "viem";
import { useEnsName } from "wagmi";

export default function VoterPage(): ReactElement {
  const { query } = useRouter();
  const { address: account } = query as { address: `0x${string}` | undefined };
  const coreVoting = useReadCoreVoting();
  const { data, status } = useVoterData(account);
  const displayName = useDisplayName(account);

  if (!account) {
    return (
      <ErrorMessage error="No address provided or address is malformed." />
    );
  }

  const numVotingVaults =
    coreVoting.vaults.length +
    (["Member", "Idle"].includes(data?.gscStatus as string) ? 1 : 0);

  return (
    <Page>
      <div className="space-y-2">
        <Breadcrumbs
          crumbs={[{ href: Routes.VOTERS, content: "All voters" }]}
          currentPage={displayName}
        />
        <VoterHeader address={account} />
      </div>

      {status === "success" ? (
        <VoterStatsRow
          gscStatus={data.gscStatus}
          proposalsCreated={data.proposalsCreated}
          proposalsVoted={data.votingHistory.length}
          votingPower={data.votingPower}
          percentOfTVP={data.percentOfTVP}
        />
      ) : (
        <VoterStatsRowSkeleton />
      )}

      {status === "success" ? (
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">
            Voting Vaults ({numVotingVaults})
          </h2>
          <VoterVaultsList account={account} />
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <h2 className="w-64 text-2xl">
            <Skeleton />
          </h2>
          <VoterVaultsListSkeleton />
        </div>
      )}

      <div className="flex w-full flex-col gap-y-4">
        <h2 className="text-2xl font-bold">
          Voting History ({data?.votingHistory.length ?? 0})
        </h2>
        {status === "success" ? (
          <div className="overflow-x-auto">
            <VotingHistoryTable history={data.votingHistory} />
          </div>
        ) : (
          <VotingHistoryTableSkeleton />
        )}
      </div>
    </Page>
  );
}

interface VoterHeaderProps {
  address: `0x${string}`;
}

function VoterHeader({ address }: VoterHeaderProps) {
  const chainId = useSupportedChainId();
  const { data: ens, isLoading: ensLoading } = useEnsName({
    address: getAddress(address),
  });

  if (ensLoading) {
    return (
      <div>
        <h1 className="w-72 text-5xl">
          <Skeleton />
        </h1>

        <h2 className="mt-2 w-48 text-2xl">
          <Skeleton />
        </h2>
      </div>
    );
  }

  return ens ? (
    <div className="w-fit">
      <h1 className="text-5xl font-bold">{ens}</h1>
      <a
        href={makeEtherscanAddressURL(address, chainId)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <h2 className="mt-2 text-2xl">
          <AddressWithEtherscan address={address} iconSize={24} />
        </h2>
      </a>
    </div>
  ) : (
    <h1 className="mt-2 w-fit text-5xl">
      <AddressWithEtherscan address={address} iconSize={36} />
    </h1>
  );
}

interface VoterData {
  gscStatus: GscStatus | undefined;
  proposalsCreated: number;
  votingHistory: ReadVote[];
  votingPower: bigint;
  percentOfTVP: number;
}

export function useVoterData(
  account: `0x${string}` | undefined,
): UseQueryResult<VoterData> {
  const coreVoting = useReadCoreVoting();
  const { gscStatus } = useGscStatus(account);

  const queryEnabled = !!account && !!gscStatus;
  return useQuery({
    queryKey: ["voter-details", account, gscStatus],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<VoterData> => {
          // display voting history in reverse chronological order, ie: most
          // recent proposals first
          // TODO: Where does GSC Voting history fit in this?
          const votingHistory = [
            ...(await coreVoting.getVotes({ account })),
          ].reverse();

          const votingPower = await coreVoting.getVotingPower({ account });
          let tvp = 0n;

          for (const vault of coreVoting.vaults) {
            if (hasTotalVotingPower(vault)) {
              tvp += await vault.getTotalVotingPower();
            }
          }

          const coreVotingProposals = await coreVoting.getProposals();
          const proposalsCreatedByAddress = await asyncFilter(
            coreVotingProposals,
            async (proposal) => {
              const createdBy = await proposal.getCreatedBy();
              return createdBy?.address === account;
            },
          );

          return {
            votingHistory,
            votingPower,
            percentOfTVP: +((Number(votingPower) / Number(tvp)) * 100).toFixed(
              1,
            ),
            gscStatus,
            proposalsCreated: proposalsCreatedByAddress.length,
          };
        }
      : undefined,
    refetchOnWindowFocus: false,
  });
}

function hasTotalVotingPower(
  vault: ReadVotingVault,
): vault is ReadVotingVault & { getTotalVotingPower: () => Promise<bigint> } {
  return (
    "getTotalVotingPower" in vault &&
    typeof vault.getTotalVotingPower === "function"
  );
}
