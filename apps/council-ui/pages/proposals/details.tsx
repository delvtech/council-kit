import { ProposalStatus, Vote } from "@delvtech/council-js";
import { Address, Hash, Transaction } from "@delvtech/drift";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { getVotingContractConfig } from "src/config/utils/getVotingContractConfig";
import { Routes } from "src/routes";
import { Breadcrumbs } from "src/ui/base/Breadcrumbs";
import { Page } from "src/ui/base/Page";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { ProposalStatsRow } from "src/ui/proposals/ProposalStatsRow/ProposalStatsRow";
import { ProposalStatsRowSkeleton } from "src/ui/proposals/ProposalStatsRow/ProposalStatsRowSkeleton";
import { Quorum } from "src/ui/proposals/Quorum/Quorum";
import { QuorumBarSkeleton } from "src/ui/proposals/Quorum/QuorumSkeleton";
import { VotingActivityTable } from "src/ui/proposals/VotingActivityTable/VotingActivityTable";
import { VotingActivityTableSkeleton } from "src/ui/proposals/VotingActivityTable/VotingActivityTableSkeleton";
import { useReadCouncil } from "src/ui/sdk/hooks/useReadCouncil";
import { useGscMembers } from "src/ui/vaults/gscVault/hooks/useGscMembers";
import { GSCOnlyToggle } from "src/ui/voters/GscOnlyToggle";
import { ProposalVoting } from "src/ui/voting/ProposalVoting";
import { ProposalVotingSkeleton } from "src/ui/voting/ProposalVotingSkeleton";
import { EnsRecords, getBulkEnsRecords } from "src/utils/getBulkEnsRecords";

export default function ProposalPage(): ReactElement | null {
  const { query, replace } = useRouter();
  const votingContractAddress = query.votingContract as Address;
  const id = BigInt((query.id as string) || 0);

  const { data, status } = useProposalDetailsPageData(
    votingContractAddress,
    id,
  );

  const { gscMembers } = useGscMembers();

  // filter votes by GSC members
  const [gscOnly, setGscOnly] = useState(false);
  const filteredVotes = useMemo(() => {
    if (data?.votes && gscOnly && gscMembers) {
      return dedupeVotes(data.votes)?.filter(({ voter }) =>
        gscMembers.includes(voter),
      );
    }
    return dedupeVotes(data?.votes);
  }, [data, gscOnly, gscMembers]);

  const votingContractConfig = getVotingContractConfig({
    chainId: useSupportedChainId(),
    address: votingContractAddress,
  });

  if (!votingContractConfig) {
    replace("/proposals");
    return null;
  }

  const proposalTitle = data?.title ?? `Proposal ${id}`;

  return (
    <Page>
      <div className="space-y-2">
        {status === "pending" ? (
          <Skeleton containerClassName="block w-1/3" />
        ) : (
          <Breadcrumbs
            crumbs={[{ href: Routes.PROPOSALS, content: "All proposals" }]}
            currentPage={proposalTitle}
          />
        )}
        <div className="flex w-full flex-col gap-y-8 md:flex-row">
          <div className="flex w-full flex-col md:max-w-lg">
            <h1 className="mb-1 w-full text-4xl font-bold">
              {status === "pending" ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                proposalTitle
              )}
            </h1>
            {data?.descriptionURL && (
              <ExternalLink href={data.descriptionURL} iconSize={18}>
                Learn more about this proposal
              </ExternalLink>
            )}
          </div>

          <div className="w-full sm:ml-auto md:w-96">
            {data ? (
              <Quorum
                current={data.currentQuorum || 0n}
                required={data.requiredQuorum}
                status={data.status}
              />
            ) : (
              <QuorumBarSkeleton />
            )}
          </div>
        </div>
      </div>

      {data ? (
        <ProposalStatsRow
          votingContractName={votingContractConfig.name}
          votingContractAddress={votingContractAddress}
          createdBy={data.createdBy}
          createdTransactionHash={data.createTransactionHash}
          endsAtDate={data.votingEndDate}
          unlockAtDate={data.unlockDate}
          lastCallAtDate={data.lastCallDate}
          executedTransactionHash={data.executeTransactionHash}
          status={data.status}
          className="mb-2"
        />
      ) : (
        <ProposalStatsRowSkeleton />
      )}

      <div className="flex w-full flex-wrap gap-20 sm:gap-y-0">
        <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
          {data ? (
            data.paragraphSummary && (
              <p className="mb-5 text-lg">{data.paragraphSummary}</p>
            )
          ) : (
            <Skeleton count={3} className="mb-5 text-lg" />
          )}
          <div className="flex">
            <h1 className="text-2xl font-medium">
              Voting Activity {filteredVotes && `(${filteredVotes.length})`}
            </h1>

            {gscMembers && (
              <GSCOnlyToggle
                on={gscOnly}
                onToggle={setGscOnly}
                disabled={status !== "success"}
                className="ml-auto"
              />
            )}
          </div>

          {data && filteredVotes ? (
            <VotingActivityTable
              votes={filteredVotes}
              voterEnsRecords={data.voterEnsRecords}
              // The GSC voting contract does not count voting power, you either
              // can or cannot vote and the voting power will always be 1 wei.
              showVotingPower={!votingContractConfig.isGsc}
            />
          ) : (
            <VotingActivityTableSkeleton />
          )}
        </div>

        <div className="grow basis-[300px] md:grow-0">
          <h2 className="mb-2 text-2xl font-medium">Your Vote</h2>

          {data ? (
            <ProposalVoting
              coreVotingAddress={votingContractAddress}
              proposalId={id}
              vaults={votingContractConfig.vaults}
            />
          ) : (
            <ProposalVotingSkeleton />
          )}
        </div>
      </div>
    </Page>
  );
}

interface ProposalDetailsPageData {
  status: ProposalStatus;
  votes?: Vote[];
  voterEnsRecords: EnsRecords;
  currentQuorum: bigint;
  createTransactionHash?: Hash;
  requiredQuorum?: bigint;
  createdBy?: Address;
  votingEndDate?: Date;
  unlockDate?: Date;
  lastCallDate?: Date;
  descriptionURL?: string;
  title?: string;
  paragraphSummary?: string;
  executeTransactionHash?: Hash;
}

function useProposalDetailsPageData(
  coreVotingAddress?: Address,
  id?: bigint,
): {
  data: ProposalDetailsPageData | undefined;
  status: QueryStatus;
} {
  const chainId = useSupportedChainId();
  const council = useReadCouncil();
  const enabled = !!coreVotingAddress && !!id;

  const { data, status } = useQuery<ProposalDetailsPageData>({
    queryKey: [
      "proposalDetailsPage",
      coreVotingAddress,
      id?.toString(),
      chainId,
    ],
    enabled,
    queryFn: enabled
      ? async (): Promise<ProposalDetailsPageData> => {
          const coreVoting = council.coreVoting(coreVotingAddress);
          const proposal = await coreVoting.getProposal(id);
          const [
            // Dates
            unlockDate,
            votingEndDate,
            lastCallDate,

            // Status
            status,
            votes,
            results,

            // Events
            createEvents,
            executedEvents,
          ] = await Promise.all([
            // Dates
            proposal ? getBlockDate(proposal.unlockBlock, chainId) : undefined,
            proposal
              ? getBlockDate(proposal.expirationBlock, chainId)
              : undefined,
            proposal
              ? getBlockDate(proposal.lastCallBlock, chainId)
              : undefined,

            // Status
            proposal.status ?? coreVoting.getProposalStatus(id),
            coreVoting.getVotes({ proposalId: id }),
            coreVoting.getProposalVotingPower(id),

            // Events
            coreVoting.getProposalCreations(),
            proposal.status === "executed"
              ? coreVoting.getProposalExecutions()
              : undefined,
          ]);

          const createEvent = createEvents.find(
            ({ proposalId }) => proposalId === id,
          );
          let createTransaction: Transaction | undefined = undefined;
          if (createEvent) {
            createTransaction = await council.drift.getTransaction({
              hash: createEvent.transactionHash,
            });
          }

          const executedEvent = executedEvents?.find(
            ({ proposalId }) => proposalId === id,
          );

          const voterEnsRecords = await getBulkEnsRecords(
            Array.from(new Set(votes?.map(({ voter }) => voter))),
            chainId,
          );

          return {
            unlockDate,
            votingEndDate,
            lastCallDate,
            status,
            votes,
            voterEnsRecords,
            currentQuorum: results.total,
            requiredQuorum: proposal.requiredQuorum,
            createdBy: createTransaction?.from,
            createTransactionHash: createEvent?.transactionHash,
            executeTransactionHash: executedEvent?.transactionHash,
          };
          // return "ProposalDetailsPageData";
        }
      : undefined,
  });

  return {
    // proposalExists: data?.proposalExists ?? false,
    data,
    status,
  };
}

/**
 * Dedupe a list of votes by only keeping the latest instance of each voter.
 */
function dedupeVotes(votes: Vote[] | undefined): Vote[] | undefined {
  if (!votes) return;
  const voteMap = new Map<Address, Vote>();
  for (const vote of votes) {
    voteMap.set(vote.voter, vote);
  }
  return Array.from(voteMap.values());
}
