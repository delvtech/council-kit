import { Ballot, ReadVote } from "@delvtech/council-viem";
import { QueryStatus, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Routes } from "src/routes";
import { Breadcrumbs } from "src/ui/base/Breadcrumbs";
import { Page } from "src/ui/base/Page";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { getBlockDate } from "src/ui/base/utils/getBlockDate";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useReadGscVoting } from "src/ui/council/hooks/useReadGscVoting";
import { ProposalStatsRow } from "src/ui/proposals/ProposalStatsRow/ProposalStatsRow";
import { ProposalStatsRowSkeleton } from "src/ui/proposals/ProposalStatsRow/ProposalStatsRowSkeleton";
import { Quorum } from "src/ui/proposals/Quorum/Quorum";
import { QuorumBarSkeleton } from "src/ui/proposals/Quorum/QuorumSkeleton";
import { VotingActivityTable } from "src/ui/proposals/VotingActivityTable/VotingActivityTable";
import { VotingActivityTableSkeleton } from "src/ui/proposals/VotingActivityTable/VotingActivityTableSkeleton";
import { useReadProposal } from "src/ui/proposals/hooks/useReadProposal";
import { useGscMembers } from "src/ui/vaults/gscVault/hooks/useGscMembers";
import { GSCOnlyToggle } from "src/ui/voters/GscOnlyToggle";
import { ProposalVoting } from "src/ui/voting/ProposalVoting";
import { ProposalVotingSkeleton } from "src/ui/voting/ProposalVotingSkeleton";
import { EnsRecords, getBulkEnsRecords } from "src/utils/getBulkEnsRecords";
import { ProposalStatus, getProposalStatus } from "src/utils/getProposalStatus";
import { useAccount, usePublicClient } from "wagmi";

export default function ProposalPage(): ReactElement {
  const { query, replace } = useRouter();
  const { id: idParam, votingContract: votingContractAddressParam } = query;

  const id = BigInt((idParam as string) || 0);
  const votingContractAddress = votingContractAddressParam as `0x${string}`;

  const account = useAccount();

  const coreVoting = useReadCoreVoting();
  const gscVoting = useReadGscVoting();
  const usedCoreVoting =
    votingContractAddress === gscVoting?.address ? gscVoting : coreVoting;

  const { data, status } = useProposalDetailsPageData(
    votingContractAddress,
    id,
    account.address,
  );
  const { gscMembers } = useGscMembers();

  // // voting activity filtering
  const [gscOnly, setGscOnly] = useState(false);
  const filteredVotes = useMemo(() => {
    if (data?.votes && gscOnly && gscMembers) {
      return dedupeVotes(data.votes).filter(({ voter }) =>
        gscMembers.some((member) => member.address === voter.address),
      );
    }
    return dedupeVotes(data?.votes);
  }, [data, gscOnly, gscMembers]);

  // // Redirect to proposals page if the voting contract is not found.
  if (!usedCoreVoting) {
    replace("/proposals");
    // Returning empty fragment is to remove the undefined type from the query params.
    return <></>;
  }

  const proposalTitle = data?.title ?? `Proposal ${id}`;

  // return <>{status}</>;

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
          votingContractName={data.votingContractName}
          votingContractAddress={votingContractAddress}
          createdBy={data.createdBy}
          createdTransactionHash={data.createdTransactionHash}
          endsAtDate={data.endsAtDate}
          unlockAtDate={data.unlockedAtDate}
          lastCallAtDate={data.lastCallDate}
          executedTransactionHash={data.executedTransactionHash}
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
              vaults={usedCoreVoting.vaults}
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
  proposalExists: boolean;
  type: "core" | "gsc";
  status: ProposalStatus;
  isActive: boolean;
  votes?: ReadVote[];
  voterEnsRecords: EnsRecords;
  createdAtBlock: bigint;
  currentQuorum: bigint;
  createdTransactionHash?: `0x${string}`;
  votingContractName?: string;
  requiredQuorum?: bigint;
  createdBy?: `0x${string}`;
  createdAtDate?: Date;
  endsAtDate?: Date;
  unlockedAtDate?: Date;
  lastCallDate?: Date;
  accountBallot?: Ballot;
  descriptionURL?: string;
  title?: string;
  paragraphSummary?: string;
  executedTransactionHash?: `0x${string}`;
}

function useProposalDetailsPageData(
  coreVotingAddress?: `0x${string}`,
  id?: bigint,
  account?: `0x${string}`,
): {
  // proposalExists: boolean;
  data: ProposalDetailsPageData | undefined;
  status: QueryStatus;
} {
  const gscVoting = useReadGscVoting();
  const config = useCouncilConfig();
  const client = usePublicClient();
  const { proposal } = useReadProposal({
    id,
    coreVoting: coreVotingAddress,
  });

  const isGsc = coreVotingAddress === gscVoting?.address;
  const votingConfig = isGsc ? config.gscVoting : config.coreVoting;
  const votingContractName = votingConfig?.name;

  const enabled = !!proposal;

  const { data, status, error } = useQuery<ProposalDetailsPageData>({
    queryKey: ["proposalDetailsPage", coreVotingAddress, String(proposal?.id)],
    enabled,
    queryFn: enabled
      ? async (): Promise<ProposalDetailsPageData> => {
          const createdTransaction = await proposal.getCreatedTransaction();
          const createdAtDate = proposal.created
            ? await getBlockDate(proposal.created, client)
            : undefined;

          const endsAtDate = proposal.expiration
            ? await getBlockDate(proposal.expiration, client)
            : undefined;

          const unlockedAtBlock = await proposal.getUnlockBlock();
          const unlockedAtDate = unlockedAtBlock
            ? await getBlockDate(unlockedAtBlock, client)
            : undefined;

          const lastCallBlock = await proposal.getLastCallBlock();
          const lastCallDate = lastCallBlock
            ? await getBlockDate(lastCallBlock, client)
            : undefined;

          const votes = await proposal.getVotes();
          const voterEnsRecords = await getBulkEnsRecords(
            Array.from(new Set(votes?.map(({ voter }) => voter.address))),
            client,
          );

          const isExecuted = await proposal.getIsExecuted();
          const currentQuorum = await proposal.getCurrentQuorum();
          const requiredQuorum = await proposal.getRequiredQuorum();
          const results = await proposal.getResults();
          const isActive = await proposal.getIsActive();
          const createdBy = await proposal.getCreatedBy();

          const accountBallot = account
            ? (await proposal.getVote({ account }))?.ballot
            : undefined;

          const proposalConfig = votingConfig?.proposals[String(id)];
          const executedTransaction = await proposal.getExecutedTransaction();

          return {
            proposalExists: !!proposal,
            type: isGsc ? "gsc" : "core",
            votingContractName,
            status: getProposalStatus({
              isExecuted,
              lastCallDate,
              currentQuorum,
              requiredQuorum,
              results,
            }),
            isActive: isActive ?? false,
            currentQuorum,
            requiredQuorum,
            createdAtBlock: proposal.created,
            createdBy: createdBy?.address,
            createdAtDate,
            endsAtDate,
            unlockedAtDate,
            lastCallDate,
            votes,
            voterEnsRecords,
            createdTransactionHash: createdTransaction?.hash,
            accountBallot,
            descriptionURL: proposalConfig?.descriptionURL,
            paragraphSummary: proposalConfig?.paragraphSummary,
            title: proposalConfig?.title,
            executedTransactionHash: executedTransaction?.hash,
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
 * Dedupe a list of votes by only keeping the latest instance.
 */
// TODO: This function breaks the build when only the generic signature is used.
// The overload signature fixes the build and maintains a strong return type.
function dedupeVotes<T extends ReadVote[] | undefined>(votes: T): T;
function dedupeVotes(votes: ReadVote[] | undefined): ReadVote[] | undefined {
  if (!votes) {
    return votes;
  }
  const byVoterAddress: Record<string, ReadVote> = {};
  for (const vote of votes) {
    byVoterAddress[vote.voter.address] = vote;
  }
  return Object.values(byVoterAddress);
}
