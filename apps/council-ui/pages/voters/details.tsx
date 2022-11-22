import { sumStrings, Vote, Voter, VoteResults } from "@council/sdk";
import { useQuery } from "@tanstack/react-query";
import { formatUnits, parseEther } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";

function useVoter(address: string | undefined) {
  const { coreVoting, context } = useCouncil();
  return useQuery(
    ["voter", address],
    async () => {
      const voter = new Voter(address as string, context);
      const votingHistory = await voter.getVotes(coreVoting.address);

      return {
        voter,
        votingHistory,
      };
    },
    {
      enabled: !!address,
    },
  );
}

export default function VoterDetailsPage(): ReactElement {
  const { query } = useRouter();
  const { address } = query as { address: string | undefined };

  const { data: voter } = useVoter(address);

  return (
    <Page>
      <div>
        <h1 className="w-full text-5xl text-accent-content">Vitalik.eth</h1>
        {address && (
          <h2 className="mt-2 w-full text-2xl underline">
            {formatAddress(address)}
          </h2>
        )}
      </div>

      <VoterStatisticsRow />

      <div className="flex w-full flex-col gap-y-8 md:flex-row md:gap-x-4 md:gap-y-0">
        {voter && (
          <div className="flex min-w-[500px] flex-col gap-y-4 sm:basis-[65%]">
            <h2 className="text-2xl font-bold">Voting History</h2>
            <VoterVoteHistoryList history={voter.votingHistory} />
          </div>
        )}

        <div className="flex flex-col gap-y-4 sm:basis-[35%]">
          <div className="text-2xl font-bold">Voting Vault (6)</div>
          <VoterVotingPower />
        </div>
      </div>
    </Page>
  );
}

function VoterStatisticsRow(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Active Proposals</div>
          <div className="daisy-stat-value text-sm">6</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Your Voting Power</div>
          <div className="daisy-stat-value text-sm">1,000,000</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">% of Total TVP</div>
          <div className="daisy-stat-value text-sm">1.2%</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Delegated to You</div>
          <div className="daisy-stat-value text-sm">90</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Participants</div>
          <div className="daisy-stat-value text-sm">2.112</div>
        </div>
      </div>
    </div>
  );
}

interface VoterVoteHistoryListProps {
  history: Vote[];
}

function VoterVoteHistoryList({
  history,
}: VoterVoteHistoryListProps): ReactElement {
  return (
    <>
      <div className="grid grid-cols-5 items-center">
        <p>Proposal</p>
        <p className="col-span-2 whitespace-nowrap">Vote Outcome</p>
        <p>Vote</p>
        <p className="whitespace-nowrap">Voting Power</p>
      </div>

      {history.map((vote) => (
        <VoterVoteHistoryItem vote={vote} key={vote.proposal.id} />
      ))}
    </>
  );
}

function useVoteResults(vote: Vote) {
  return useQuery([], async () => {
    const results = await vote.proposal.getResults();
    return results;
  });
}

function VoterVoteHistoryItem({ vote }: { vote: Vote }): ReactElement {
  const id = vote.proposal.id;
  const votingPower = vote.power;
  const ballot = vote.ballot;

  const { data: voteResults } = useVoteResults(vote);

  return (
    <div className="grid grid-cols-5 items-center">
      <p className="whitespace-nowrap underline">Proposal #{id}</p>
      <div className="col-span-2 pr-4">
        {voteResults && <VoteResultBar results={voteResults} />}
      </div>
      <p className="text-green-500">{ballot.toUpperCase()}</p>
      <p>{formatBalance(votingPower)}</p>
    </div>
  );
}

interface VoteResultBarProps {
  results: VoteResults;
}

function VoteResultBar({ results }: VoteResultBarProps) {
  const yesResult = results.yes;
  const noResult = results.no;
  const maybeResult = results.maybe;
  const resultsTotal = parseEther(
    sumStrings([yesResult, noResult, maybeResult]),
  );

  const yesPercent =
    +formatUnits(parseEther(yesResult).div(resultsTotal), 0) * 100;
  // const noPercent =
  //   +formatUnits(parseEther(noResult).div(resultsTotal), 0) * 100;
  const maybePercent =
    +formatUnits(parseEther(maybeResult).div(resultsTotal), 0) * 100;

  return (
    <svg height="10" width="100%">
      <line
        x1="0"
        y1="0"
        x2={`${yesPercent}%`}
        y2="0"
        className="stroke-green-500"
        strokeWidth={10}
      />
      <line
        x1={`${yesPercent}%`}
        y1="0"
        x2={`${yesPercent + maybePercent}%`}
        y2="0"
        className="stroke-neutral"
        strokeWidth={10}
      />
      <line
        x1={`${yesPercent + maybePercent}%`}
        y1="0"
        x2="100%"
        y2="0"
        className="stroke-red-500"
        strokeWidth={10}
      />
    </svg>
  );
}

function VoterVotingPower(): ReactElement {
  return (
    <div className="flex h-96 flex-col gap-y-4 overflow-auto pr-3">
      <div className="flex flex-col gap-y-2">
        <h3 className="text-xl font-bold underline">Locking Vault</h3>
        <div className="flex">
          <p>Tokens Deposited</p>
          <p className="ml-auto">6,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Voting Power</p>
          <p className="ml-auto">1,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Current Delegation</p>
          <p className="ml-auto">Self</p>
        </div>
        <div className="flex">
          <p>Wallets Delegated</p>
          <p className="ml-auto underline">12</p>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-bold underline">Locking Vault</h3>
        <div className="flex">
          <p>Tokens Deposited</p>
          <p className="ml-auto">6,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Voting Power</p>
          <p className="ml-auto">1,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Current Delegation</p>
          <p className="ml-auto">Self</p>
        </div>
        <div className="flex">
          <p>Wallets Delegated</p>
          <p className="ml-auto underline">12</p>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-bold underline">Locking Vault</h3>
        <div className="flex">
          <p>Tokens Deposited</p>
          <p className="ml-auto">6,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Voting Power</p>
          <p className="ml-auto">1,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Current Delegation</p>
          <p className="ml-auto">Self</p>
        </div>
        <div className="flex">
          <p>Wallets Delegated</p>
          <p className="ml-auto underline">12</p>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h3 className="text-lg font-bold underline">Locking Vault</h3>
        <div className="flex">
          <p>Tokens Deposited</p>
          <p className="ml-auto">6,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Voting Power</p>
          <p className="ml-auto">1,000 ELFI</p>
        </div>
        <div className="flex">
          <p>Current Delegation</p>
          <p className="ml-auto">Self</p>
        </div>
        <div className="flex">
          <p>Wallets Delegated</p>
          <p className="ml-auto underline">12</p>
        </div>
      </div>
    </div>
  );
}
