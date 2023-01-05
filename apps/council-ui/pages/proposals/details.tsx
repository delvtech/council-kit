import { Ballot, getBlockDate, Proposal, Vote } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { useCouncil } from "src/ui/council/useCouncil";
import {
  ProposalStatsBar,
  ProposalStatsBarSkeleton,
} from "src/ui/proposals/components/ProposalStatsBar";
import {
  VotingActivityTable,
  VotingActivityTableSkeleton,
} from "src/ui/proposals/components/VotingActivityTable";
import {
  QuorumBar,
  QuorumBarSkeleton,
} from "src/ui/proposals/QuorumBar/QuorumBar";
import {
  ProposalVoting,
  ProposalVotingSkeleton,
} from "src/ui/voting/components/ProposalVoting";
import { useGSCVote } from "src/ui/voting/hooks/useGSCVote";
import { useVote } from "src/ui/voting/hooks/useVote";
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

  if (!id || !votingContractAddress) {
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

  switch (status) {
    case "error":
      return <ErrorMessage error={error} />;

    default:
      return (
        <div className="flex flex-col items-start max-w-5xl px-4 m-auto mt-16 gap-y-10">
          <div className="flex flex-wrap items-center w-full gap-4">
            <h1 className="mb-4 text-5xl font-bold whitespace-nowrap">
              {data?.name ?? `Proposal ${id}`}
            </h1>

            <div className="sm:ml-auto w-96 sm:w-72">
              {(() => {
                switch (status) {
                  case "success":
                    if (data.requiredQuorum) {
                      return (
                        <QuorumBar
                          current={data.currentQuorum}
                          required={data.requiredQuorum}
                        />
                      );
                    }

                  case "loading":
                    return <QuorumBarSkeleton />;
                }
              })()}
            </div>
          </div>

          {(() => {
            switch (status) {
              case "success":
                return (
                  <ProposalStatsBar
                    createdAtDate={data?.createdAtDate}
                    endsAtDate={data?.endsAtDate}
                    unlockAtDate={data?.unlockedAtDate}
                    lastCallAtDate={data?.lastCallAtDate}
                  />
                );

              case "loading":
                return <ProposalStatsBarSkeleton />;
            }
          })()}

          <div className="flex flex-wrap w-full gap-10 sm:gap-y-0">
            <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
              <h1 className="text-2xl font-medium">Voting Activity</h1>
              {(() => {
                switch (status) {
                  case "success":
                    return <VotingActivityTable votes={data.votes} />;

                  case "loading":
                    return <VotingActivityTableSkeleton />;
                }
              })()}
            </div>

            <div className="grow basis-[300px] md:grow-0">
              <h2 className="mb-2 text-2xl font-medium">Your Vote</h2>

              {(() => {
                switch (status) {
                  case "success":
                    return (
                      <ProposalVoting
                        atBlock={data.createdAtBlock || blockNumber}
                        account={address}
                        accountBallot={data?.accountBallot}
                        disabled={!signer || !data?.isActive}
                        onVote={handleVote}
                      />
                    );

                  case "loading":
                    return <ProposalVotingSkeleton />;
                }
              })()}
            </div>
          </div>
        </div>
      );
  }
}

interface ProposalDetailsPageData {
  type: "core" | "gsc";
  name: string;
  isActive: boolean;
  currentQuorum: string;
  requiredQuorum: string | null;
  createdAtBlock: number | null;
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockedAtDate: Date | null;
  lastCallAtDate: Date | null;
  votes: Vote[];
  accountBallot?: Ballot;
}

function useProposalDetailsPageData(
  votingContractAddress?: string,
  id?: number,
  account?: string,
) {
  const { context, coreVoting, gscVoting } = useCouncil();
  const provider = context.provider;

  return useQuery<ProposalDetailsPageData>({
    queryKey: ["proposalDetailsPage", id],
    enabled:
      votingContractAddress !== undefined &&
      id !== undefined &&
      account !== undefined,
    queryFn: async () => {
      // safe to cast since the fn is disabled if these aren't defined.
      votingContractAddress = votingContractAddress as string;
      id = id as number;
      account = account as string;

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

      const createdAtBlock = await proposal.getCreatedBlock();
      const createdAtDate = createdAtBlock
        ? await getBlockDate(createdAtBlock, provider)
        : null;

      const endsAtBlock = await proposal.getExpirationBlock();
      const endsAtDate = endsAtBlock
        ? await getBlockDate(endsAtBlock, provider)
        : null;

      const unlockedAtBlock = await proposal.getUnlockBlock();
      const unlockedAtDate = unlockedAtBlock
        ? await getBlockDate(unlockedAtBlock, provider)
        : null;

      const lastCallAtBlock = await proposal.getLastCallBlock();
      const lastCallAtDate = lastCallAtBlock
        ? await getBlockDate(lastCallAtBlock, provider)
        : null;

      return {
        type,
        name: proposal.name,
        isActive: await proposal.getIsActive(),
        currentQuorum: await proposal.getCurrentQuorum(),
        requiredQuorum: await proposal.getRequiredQuorum(),
        createdAtBlock,
        createdAtDate,
        endsAtDate,
        unlockedAtDate,
        lastCallAtDate,
        votes: await proposal.getVotes(),
        accountBallot: (await proposal.getVote(account))?.ballot,
      };
    },
  });
}
