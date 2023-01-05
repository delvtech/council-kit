import { Ballot, Vote } from "@council/sdk";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import FormattedBallot from "src/ui/voting/ballot/FormattedBallot";

interface VotingActivityTableProps {
  votes: Vote[] | null;
  isLoading?: boolean;
}

export function VotingActivityTable({
  votes,
}: VotingActivityTableProps): ReactElement {
  return (
    <div className="w-full overflow-auto max-h-96">
      <table className="w-full daisy-table-zebra daisy-table">
        <thead>
          <tr>
            <th className="select-none">Voter</th>

            <th className="select-none">
              <span className="mr-1">Voting Power</span>
            </th>

            <th className="select-none">Ballot</th>
          </tr>
        </thead>

        <tbody className="h-24 overflow-auto">
          {votes &&
            votes.map((vote, i) => (
              <VotingActivityTableRow
                key={`${vote.voter.address}-${vote.ballot}-${i}`}
                address={vote.voter.address}
                votePower={vote.power}
                voteBallot={vote.ballot}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}

interface VotingActivityTableRowProps {
  address: string;
  votePower: string;
  voteBallot: Ballot;
}

function VotingActivityTableRow({
  address,
  votePower,
  voteBallot,
}: VotingActivityTableRowProps) {
  const displayName = useDisplayName(address);
  return (
    <tr>
      <th>
        <a
          className="hover:underline"
          href={makeEtherscanAddressURL(address)}
          target="_blank"
          rel="noreferrer"
        >
          {displayName}
          <ExternalLinkSVG size={16} />
        </a>
      </th>
      <td>{formatBalance(votePower)}</td>
      <td>
        <FormattedBallot ballot={voteBallot} />
      </td>
    </tr>
  );
}

// ================ Skeletons ================

export function VotingActivityTableSkeleton(): ReactElement {
  return (
    <div className="w-full overflow-auto max-h-96">
      <table className="w-full daisy-table-zebra daisy-table">
        <thead>
          <tr>
            <th className="select-none w-72">Voter</th>

            <th className="select-none">
              <span className="mr-1">Voting Power</span>
            </th>

            <th className="select-none">Ballot</th>
          </tr>
        </thead>

        <tbody className="h-24 overflow-auto">
          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
            <td>
              <Skeleton />
            </td>
            <td>
              <Skeleton />
            </td>
          </tr>

          <tr>
            <th>
              <Skeleton />
            </th>
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
  );
}
