import { getBlockDate, Vote } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useCouncil } from "src/ui/council/useCouncil";
import QuorumBar from "src/ui/QuorumBar";
import { formatBalance } from "src/ui/utils/formatBalance";
import ProposalVoting from "src/ui/voting/ProposalVoting";
import { useAccount } from "wagmi";

// TODO @cashd: stats bar returns unix timestamp of 0
export default function ProposalPage(): ReactElement {
  const {
    query: { id },
  } = useRouter();
  const proposalId = +(id as string);

  const { address } = useAccount();
  const { data } = useProposalDetailsPageData(proposalId);

  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-start gap-y-10 px-4">
      <div className="flex w-full flex-wrap items-center gap-4">
        <h1 className="mb-4 whitespace-nowrap text-5xl text-accent-content underline">
          Proposal {proposalId ?? "🤷"}
        </h1>

        {data?.currentQuorum && data?.requiredQuorum && (
          <div className="sm:ml-auto">
            <QuorumBar
              current={data?.currentQuorum}
              required={data?.requiredQuorum}
            />
          </div>
        )}
      </div>

      <ProposalStatsBar
        createdAt={data?.createdAt}
        endsAt={data?.endsAt}
        unlockedAt={data?.unlockedAt}
        lastCallAt={data?.lastCallAt}
      />

      <div className="flex w-full flex-wrap gap-10 sm:gap-y-0">
        <div className="flex min-w-[280px] grow flex-col gap-y-4 sm:basis-[50%]">
          <h1 className="text-2xl text-accent-content">Voting Activity</h1>
          <ProposalVotingActivity votes={data?.votes} />
        </div>

        <div className="grow basis-[300px] md:grow-0">
          <ProposalVoting account={address} />
        </div>
      </div>
    </div>
  );
}

function useProposalDetailsPageData(proposalId?: number) {
  const { context, coreVoting } = useCouncil();
  const provider = context.provider;

  return useQuery([], async () => {
    const proposal = coreVoting.getProposal(proposalId!);

    const currentQuorum = await proposal!.getCurrentQuorum();
    const requiredQuorum = await proposal!.getRequiredQuorum();

    const createdAt = await getBlockDate(
      await +proposal!.getCreatedBlock(),
      provider,
    );

    const endsAt = await getBlockDate(
      await +proposal!.getExpirationBlock(),
      provider,
    );

    const unlockedAt = await getBlockDate(
      await +proposal!.getUnlockBlock(),
      provider,
    );

    const lastCallAt = await getBlockDate(
      await +proposal!.getLastCallBlock(),
      provider,
    );

    const votes = await proposal?.getVotes();

    return {
      proposal,
      currentQuorum,
      requiredQuorum,
      createdAt,
      endsAt,
      unlockedAt,
      lastCallAt,
      votes,
    };
  });
}

interface ProposalStatsBarProps {
  createdAt?: Date | null;
  endsAt?: Date | null;
  unlockedAt?: Date | null;
  lastCallAt?: Date | null;
}

function ProposalStatsBar({
  createdAt,
  endsAt,
  unlockedAt,
  lastCallAt,
}: ProposalStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Contract</div>
          <div className="daisy-stat-value text-sm">Core Voting</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Created</div>
          <div className="daisy-stat-value text-sm">
            {createdAt?.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Ends</div>
          <div className="daisy-stat-value text-sm">
            {endsAt?.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Unlocked</div>
          <div className="daisy-stat-value text-sm">
            {unlockedAt?.toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Last Call</div>
          <div className="daisy-stat-value text-sm">
            {lastCallAt?.toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProposalVotingActivityProps {
  votes?: Vote[];
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
            <h2 className="underline">
              {/* TODO @cashd: find a way to get ENS or address */}
              {voter.address.slice(0, 5)}...{voter.address.slice(-4)}
            </h2>
            <h2>{formatBalance(vote.power)}</h2>
            <h2 className="text-green-400">{vote.ballot.toUpperCase()}</h2>
          </div>
        );
      })}
    </>
  );
}

interface ProposalQuorum {
  currentQuorum?: string | null;
  requiredQuorum?: string | null;
}
