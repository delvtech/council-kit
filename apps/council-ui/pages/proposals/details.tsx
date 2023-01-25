import { Ballot, getBlockDate, Proposal, Vote } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { councilConfigs } from "src/config/council.config";
import { EnsRecords, getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import ExternalLink from "src/ui/base/links/ExternalLink";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { ProposalStatsBar } from "src/ui/proposals/ProposalStatsBar";
import { ProposalStatsBarSkeleton } from "src/ui/proposals/ProposalStatsBarSkeleton";
import { QuorumBar } from "src/ui/proposals/QuorumBar";
import { QuorumBarSkeleton } from "src/ui/proposals/QuorumBarSkeleton";
import { VotingActivityTable } from "src/ui/proposals/VotingActivityTable";
import { VotingActivityTableSkeleton } from "src/ui/proposals/VotingActivityTableSkeleton";
import { useGSCVote } from "src/ui/voting/hooks/useGSCVote";
import { useVote } from "src/ui/voting/hooks/useVote";
import { ProposalVoting } from "src/ui/voting/ProposalVoting";
import { ProposalVotingSkeleton } from "src/ui/voting/ProposalVotingSkeleton";
import { useAccount, useBlockNumber, useSigner } from "wagmi";

export default function ProposalPage(): ReactElement {
  const { query, replace } = useRouter();

  // TODO: handle and validate the query strings
  const id = +(query.id as string);
  const votingContractAddress = query.votingContract as string;

  const { data: signer } = useSigner();
  const { address } = useAccount();

  // Data fetching
  const { data, error, status } = useProposalDetailsPageData(
    votingContractAddress,
    id,
    address,
  );
  const { data: blockNumber } = useBlockNumber();

  // Mutations
  const { mutate: vote } = useVote();
  const { mutate: gscVote } = useGSCVote();

  if (id < 0 || !votingContractAddress) {
    replace("/404");
  }

  function handleVote(ballot: Ballot) {
    if (!data || !signer) {
      return;
    }
    const voteArgs = {
      signer,
      proposalId: id,
      ballot,
    };
    if (data.type === "gsc") {
      return gscVote(voteArgs);
    }
    return vote(voteArgs);
  }

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  return (
    <Page>
      <div className="flex flex-wrap w-full gap-4 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <h1 className="inline text-5xl font-bold">
            {data?.name ?? `Proposal ${id}`}
          </h1>
          {data?.descriptionURL && (
            <ExternalLink
              href={data.descriptionURL}
              iconSize={18}
              className="self-start"
            >
              <span>Learn more about this proposal</span>
            </ExternalLink>
          )}
        </div>

        <div className="sm:ml-auto w-96 sm:w-72">
          {status === "success" ? (
            <QuorumBar
              current={data.currentQuorum}
              required={data.requiredQuorum}
              votingEnds={data.endsAtDate}
            />
          ) : (
            <QuorumBarSkeleton />
          )}
        </div>
      </div>

      {status === "success" ? (
        <ProposalStatsBar
          votingContractAddress={votingContractAddress}
          createdBy={data.createdBy}
          createdTransactionHash={data.createdTransactionHash}
          createdAtDate={data.createdAtDate}
          endsAtDate={data.endsAtDate}
          unlockAtDate={data.unlockedAtDate}
          lastCallAtDate={data.lastCallAtDate}
        />
      ) : (
        <ProposalStatsBarSkeleton />
      )}

      <div className="flex flex-wrap w-full gap-10 sm:gap-y-0">
        <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
          <h1 className="text-2xl font-medium">
            Voting Activity {data?.votes && `(${data.votes.length})`}
          </h1>

          {status === "success" ? (
            <VotingActivityTable
              votes={data.votes}
              voterEnsRecords={data.voterEnsRecords}
            />
          ) : (
            <VotingActivityTableSkeleton />
          )}
        </div>

        <div className="grow basis-[300px] md:grow-0">
          <h2 className="mb-2 text-2xl font-medium">Your Vote</h2>

          {status === "success" ? (
            <ProposalVoting
              atBlock={data.createdAtBlock || blockNumber}
              account={address}
              accountBallot={data?.accountBallot}
              disabled={!signer || !data?.isActive}
              onVote={handleVote}
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
  type: "core" | "gsc";
  name: string;
  isActive: boolean;
  currentQuorum: string;
  requiredQuorum: string | null;
  createdAtBlock: number | null;
  createdBy: string | null;
  createdAtDate: Date | null;
  createdTransactionHash: string | null;
  endsAtDate: Date | null;
  unlockedAtDate: Date | null;
  lastCallAtDate: Date | null;
  votes: Vote[];
  accountBallot?: Ballot;
  voterEnsRecords: EnsRecords;
  descriptionURL: string | null;
}

function useProposalDetailsPageData(
  votingContractAddress?: string,
  id?: number,
  account?: string,
) {
  const { context, coreVoting, gscVoting } = useCouncil();
  const provider = context.provider;
  const chainId = useChainId();
  const proposalConfig = councilConfigs[chainId].coreVoting.proposals;

  const queryEnabled =
    votingContractAddress !== undefined &&
    id !== undefined &&
    account !== undefined;
  return useQuery<ProposalDetailsPageData>({
    queryKey: ["proposalDetailsPage", id],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<ProposalDetailsPageData> => {
          let proposal: Proposal | undefined;
          let type: ProposalDetailsPageData["type"] = "core";

          if (votingContractAddress === coreVoting.address) {
            proposal = coreVoting.getProposal(id);
          } else if (votingContractAddress === gscVoting?.address) {
            type = "gsc";
            proposal = gscVoting.getProposal(id);
          } else {
            throw new Error(
              `No config found for voting contract address ${votingContractAddress}, See src/config.`,
            );
          }

          const createdTransactionHash =
            await proposal.getCreatedTransactionHash();
          const createdAtBlock = await proposal.getCreatedBlock();
          const createdAtDate = createdAtBlock
            ? await getBlockDate(createdAtBlock, provider)
            : null;

          const endsAtBlock = await proposal.getExpirationBlock();
          const endsAtDate = endsAtBlock
            ? await getBlockDate(endsAtBlock, provider, {
                estimateFutureDates: true,
              })
            : null;

          const unlockedAtBlock = await proposal.getUnlockBlock();
          const unlockedAtDate = unlockedAtBlock
            ? await getBlockDate(unlockedAtBlock, provider, {
                estimateFutureDates: true,
              })
            : null;

          const lastCallAtBlock = await proposal.getLastCallBlock();
          const lastCallAtDate = lastCallAtBlock
            ? await getBlockDate(lastCallAtBlock, provider, {
                estimateFutureDates: true,
              })
            : null;

          const votes = await proposal.getVotes();
          const voterEnsRecords = await getBulkEnsRecords(
            Array.from(new Set(votes.map((vote) => vote.voter.address))),
            provider,
          );

          return {
            type,
            name: proposal.name,
            isActive: await proposal.getIsActive(),
            currentQuorum: await proposal.getCurrentQuorum(),
            requiredQuorum: await proposal.getRequiredQuorum(),
            createdAtBlock,
            createdBy: await proposal.getCreatedBy(),
            createdAtDate,
            endsAtDate,
            unlockedAtDate,
            lastCallAtDate,
            votes: await proposal.getVotes(),
            voterEnsRecords,
            createdTransactionHash,
            accountBallot: (await proposal.getVote(account))?.ballot,
            descriptionURL: proposalConfig[id.toString()]
              ? proposalConfig[id.toString()].descriptionURL
              : null,
          };
        }
      : undefined,
  });
}
