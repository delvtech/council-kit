import { Vote } from "@delvtech/council-js";
import { fixed } from "@delvtech/fixed-point-wasm";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Routes } from "src/routes";
import { Breadcrumbs } from "src/ui/base/Breadcrumbs";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Page } from "src/ui/base/Page";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { AddressWithEtherscan } from "src/ui/ens/AdddressWithEtherscan";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadCouncil } from "src/ui/sdk/useReadCouncil";
import { VoterStatsRowSkeleton } from "src/ui/voters/skeletons/VoterStatsRowSkeleton";
import { VoterStatsRow } from "src/ui/voters/VoterStatsRow";
import { VoterVaultsList } from "src/ui/voters/VoterVaultsList";
import { VoterVaultsListSkeleton } from "src/ui/voters/VoterVaultsListSkeleton";
import { VotingHistoryTableSkeleton } from "src/ui/voters/VotingHistorySkeleton";
import { VotingHistoryTable } from "src/ui/voters/VotingHistoryTable";
import { makeEtherscanAddressURL } from "src/utils/etherscan/makeEtherscanAddressURL";
import { GscStatus } from "src/utils/gscVault/types";
import { getTotalVotingPower } from "src/vaults/getTotalVotingPower";
import { getAddress } from "viem";
import { useEnsName } from "wagmi";

export default function VoterPage(): ReactElement {
  const { query } = useRouter();
  const { address: account } = query as { address: `0x${string}` | undefined };
  const { data, status } = useVoterData(account);
  const displayName = useDisplayName(account);
  const config = useCouncilConfig();

  if (!account) {
    return (
      <ErrorMessage error="No address provided or address is malformed." />
    );
  }

  const numVotingVaults =
    config.coreVoting.vaults.length +
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
          percentOfTVP={data.percentOfTvp}
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
  votingHistory: Vote[];
  votingPower: bigint;
  percentOfTvp: number;
}

export function useVoterData(
  account: `0x${string}` | undefined,
): UseQueryResult<VoterData> {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const config = useCouncilConfig();
  const enabled = !!account && !!council;

  return useQuery({
    queryKey: ["voter-details", chainId, account],
    enabled,
    queryFn: enabled
      ? async (): Promise<VoterData> => {
          const voterData: VoterData = {
            gscStatus: undefined,
            proposalsCreated: 0,
            votingHistory: [],
            votingPower: 0n,
            percentOfTvp: 0,
          };
          let tvp = 0n;

          const coreVoting = council.coreVoting(config.coreVoting.address);
          // Single list of requests to be awaited in parallel
          const requests: Promise<any>[] = [];

          // GSC status
          if (config.gscVoting) {
            const gscVaultAddress = config.gscVoting.vaults[0].address;
            requests.push(
              council.gscVault(gscVaultAddress).
            );
          }

          // Proposals created
          const coreVotingProposals = await coreVoting.getProposalCreations();
          for (const { transactionHash } of coreVotingProposals) {
            requests.push(
              council.drift
                .getTransaction({
                  hash: transactionHash,
                })
                .then(({ from }) => {
                  if (from === account) {
                    voterData.proposalsCreated++;
                  }
                }),
            );
          }

          // Votes
          requests.push(
            coreVoting.getVotes({ voter: account }).then((votes) => {
              voterData.votingHistory = votes.reverse();
            }),
          );

          // Voting power and TVP
          for (const vault of config.coreVoting.vaults) {
            requests.push(
              council
                .votingVault(vault.address)
                .getVotingPower({ voter: account })
                .then((vp) => {
                  voterData.votingPower += vp;
                }),
            );
            requests.push(
              getTotalVotingPower({ vault, council }).then((vaultTvp) => {
                if (vaultTvp) {
                  tvp += vaultTvp;
                }
              }),
            );
          }

          await Promise.all(requests);

          voterData.percentOfTvp = fixed(voterData.votingPower)
            .div(tvp)
            .mul(100)
            .toNumber();

          return {
            votingHistory,
            votingPower,
            percentOfTvp: +((Number(votingPower) / Number(tvp)) * 100).toFixed(
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
