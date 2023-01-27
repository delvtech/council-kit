import { Vote } from "@council/sdk";
import Link from "next/link";
import { ReactElement } from "react";
import { makeProposalURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import FormattedBallot from "src/ui/voting/FormattedBallot";

interface VotingHistoryTableProps {
  history: Vote[];
}

export function VotingHistoryTable({
  history,
}: VotingHistoryTableProps): ReactElement {
  if (history.length === 0) {
    return <h2 className="text-lg">No voting history for this account.</h2>;
  }

  return (
    <table className="w-full md:max-w-3xl daisy-table">
      <thead>
        <tr>
          <th>Proposal</th>
          <th>Voting Power</th>
          <th>Vote</th>
        </tr>
      </thead>
      <tbody>
        {history.map((vote) => {
          return <VoteHistoryRow vote={vote} key={vote.proposal.id} />;
        })}
      </tbody>
    </table>
  );
}

function VoteHistoryRow({ vote }: { vote: Vote }): ReactElement {
  const id = vote.proposal.id;
  const votingPower = vote.power;
  const coreVotingName = vote.proposal.votingContract.name;

  return (
    <tr>
      <td>
        <Link
          className="hover:underline hover:cursor-pointer"
          href={makeProposalURL(vote.proposal.votingContract.address, id)}
        >
          {coreVotingName} Proposal {id}
        </Link>
      </td>
      <td>{formatBalance(votingPower)}</td>
      <td>
        <FormattedBallot ballot={vote.ballot} />
      </td>
    </tr>
  );
}
