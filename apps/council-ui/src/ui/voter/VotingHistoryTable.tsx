import { Vote } from "@council/sdk";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { VoteResultBar } from "src/ui/proposals/VoteResultBar";
import FormattedBallot from "src/ui/voting/FormattedBallot";

interface VotingHistoryTableProps {
  history: Vote[];
}

export function VotingHistoryTable({
  history,
}: VotingHistoryTableProps): ReactElement {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="daisy-table w-full max-w-3xl">
          <thead>
            <tr>
              <th className="select-none">Proposal</th>
              <th className="select-none">Vote Outcome</th>
              <th className="select-none">Vote</th>
              <th className="select-none">Voting Power</th>
            </tr>
          </thead>
          <tbody>
            {history.map((vote) => {
              return <VoteHistoryRow vote={vote} key={vote.proposal.id} />;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// TODO @cashd: un-stub data when the useVoteResults hook simulates reading at last call block
function VoteHistoryRow({ vote }: { vote: Vote }): ReactElement {
  // const { data: voteResults } = useVoteResults(vote);
  const id = vote.proposal.id;
  const votingPower = vote.power;

  return (
    <tr>
      <td>{vote.proposal.name ?? `Proposal #${id}`}</td>
      <td>
        <VoteResultBar
          yesResults={"5000000000000000000000"}
          noResults={"2000000000000000000000"}
          maybeResults={"1000000000000000000000"}
        />
      </td>
      <td>
        <FormattedBallot ballot={vote.ballot} />
      </td>
      <td>{formatBalance(votingPower)}</td>
    </tr>
  );
}
