import { Vote } from "@council/sdk";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
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
        <table className="w-full md:max-w-3xl daisy-table">
          <thead>
            <tr>
              <th>Proposal</th>
              <th>Vote</th>
              <th>Voting Power</th>
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

function VoteHistoryRow({ vote }: { vote: Vote }): ReactElement {
  const id = vote.proposal.id;
  const votingPower = vote.power;

  return (
    <tr>
      <td>{vote.proposal.name ?? `Proposal #${id}`}</td>
      <td>
        <FormattedBallot ballot={vote.ballot} />
      </td>
      <td>{formatBalance(votingPower)}</td>
    </tr>
  );
}

// ================ Skeletons ================

export function VotingHistoryTableSkeleton(): ReactElement {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full max-w-xl daisy-table">
          <thead>
            <tr>
              <th className="w-24">Proposal</th>
              <th className="w-24">Vote</th>
              <th className="w-24">Voting Power</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>

            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>

            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>

            <tr>
              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>

              <td>
                <Skeleton />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
