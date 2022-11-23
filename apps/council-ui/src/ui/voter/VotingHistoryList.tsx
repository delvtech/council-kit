import { Vote } from "@council/sdk";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useVoteResults } from "src/ui/proposals/hooks/useVoteResults";
import { VoteResultBar } from "src/ui/proposals/VoteResultBar";

interface VotingHistoryListProps {
  history: Vote[];
}

export function VotingHistoryList({
  history,
}: VotingHistoryListProps): ReactElement {
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

function VoterVoteHistoryItem({ vote }: { vote: Vote }): ReactElement {
  const { data: voteResults } = useVoteResults(vote);

  const id = vote.proposal.id;
  const votingPower = vote.power;
  const ballot = vote.ballot;

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
