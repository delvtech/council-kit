import { getBlockDate, Proposal, Vote } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import QuorumBar from "src/ui/components/QuorumBar/QuorumBar";
import { useCouncil } from "src/ui/council/useCouncil";
import ProposalVoting from "src/ui/voting/ProposalVoting";
import { useAccount } from "wagmi";

export default function ProposalPage(): ReactElement {
  const {
    query: { id },
  } = useRouter();
  const proposalId = +(id as string);

  const { address } = useAccount();
  const { data, isLoading } = useProposalDetailsPageData(proposalId);

  if (isLoading) {
    return (
      <div className="w-48 m-auto mt-48 px-8">
        <progress className="daisy-progress"></progress>
      </div>
    );
  }

  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-start gap-y-10 px-4">
      <div className="flex w-full flex-wrap items-center gap-4">
        {data && (
          <h1 className="mb-4 whitespace-nowrap text-5xl text-accent-content underline">
            {data.proposal.name ?? `Proposal ${proposalId}` ?? "🤷"}
          </h1>
        )}

        {data && data.requiredQuorum && (
          <div className="sm:ml-auto">
            <QuorumBar
              current={data.currentQuorum}
              required={data.requiredQuorum}
            />
          </div>
        )}
      </div>

      {data && (
        <ProposalStatsBar
          createdAtDate={data.createdAtDate}
          endsAtDate={data.endsAtDate}
          unlockedAtDate={data.unlockedAtDate}
          lastCallAtDate={data.lastCallAtDate}
        />
      )}

      <div className="flex w-full flex-wrap gap-10 sm:gap-y-0">
        <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
          <h1 className="text-2xl text-accent-content">Voting Activity</h1>
          {data && <ProposalVotingActivity votes={data.votes} />}
        </div>

        <div className="grow basis-[300px] md:grow-0">
          <ProposalVoting account={address} />
        </div>
      </div>
    </div>
  );
}

interface ProposalDetailsPageData {
  proposal: Proposal;
  currentQuorum: string;
  requiredQuorum: string | null;
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockedAtDate: Date | null;
  lastCallAtDate: Date | null;
  votes: Vote[];
}

function useProposalDetailsPageData(proposalId?: number) {
  const { context, coreVoting } = useCouncil();
  const provider = context.provider;

  return useQuery<ProposalDetailsPageData | null>({
    queryKey: ["proposalDetailsPage", proposalId],
    enabled: proposalId !== undefined,
    queryFn: async () => {
      const proposal = coreVoting.getProposal(
        proposalId as number /* safe to cast because enabled is set */,
      );

      const currentQuorum = await proposal.getCurrentQuorum();
      const requiredQuorum = await proposal.getRequiredQuorum();

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

      const votes = await proposal.getVotes();

      return {
        proposal,
        currentQuorum,
        requiredQuorum,
        createdAtDate,
        endsAtDate,
        unlockedAtDate,
        lastCallAtDate,
        votes,
      };
    },
  });
}

interface ProposalStatsBarProps {
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockedAtDate: Date | null;
  lastCallAtDate: Date | null;
}

function ProposalStatsBar({
  createdAtDate,
  endsAtDate,
  unlockedAtDate,
  lastCallAtDate,
}: ProposalStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Contract</div>
          <div className="daisy-stat-value text-sm">Core Voting</div>
        </div>
      </div>

      {createdAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Created</div>
            <div className="daisy-stat-value text-sm">
              {createdAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {endsAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Voting Ends</div>
            <div className="daisy-stat-value text-sm">
              {endsAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {unlockedAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Unlocked</div>
            <div className="daisy-stat-value text-sm">
              {unlockedAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {lastCallAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Last Call</div>
            <div className="daisy-stat-value text-sm">
              {lastCallAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProposalVotingActivityProps {
  votes: Vote[] | null;
}

function ProposalVotingActivity({
  votes,
}: ProposalVotingActivityProps): ReactElement {
  return (
    <>
      <div className="grid grid-cols-3">
        <h2>Voter</h2>
        <h2>Voting Power</h2>
        <h2>Ballot</h2>
      </div>
      <input
        type="text"
        placeholder="Search"
        className="daisy-input-bordered daisy-input bg-base-200"
      />
      {votes?.map((vote) => {
        const voter = vote.voter;
        return (
          <div className="grid grid-cols-3" key={voter.address}>
            <h2 className="underline">{formatAddress(voter.address)}</h2>
            <h2>{formatBalance(vote.power)}</h2>
            <h2 className="text-green-400">{vote.ballot.toUpperCase()}</h2>
          </div>
        );
      })}
    </>
  );
}
