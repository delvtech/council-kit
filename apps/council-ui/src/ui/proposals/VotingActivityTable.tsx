import { Ballot, Vote } from "@council/sdk";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { EnsRecords } from "src/ens/getBulkEnsRecords";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import FormattedBallot from "src/ui/voting/FormattedBallot";

interface VotingActivityTableProps {
  votes: Vote[] | null;
  voterEnsRecords: EnsRecords;
}

export function VotingActivityTable({
  votes,
  voterEnsRecords,
}: VotingActivityTableProps): ReactElement {
  return (
    <div className="w-full overflow-auto max-h-96">
      <table className="w-full daisy-table-zebra daisy-table">
        <thead>
          <tr>
            <th>Voter</th>
            <th>Voting Power</th>
            <th>Ballot</th>
          </tr>
        </thead>

        <tbody className="h-24 overflow-auto">
          {votes &&
            votes.map((vote, i) => (
              <VotingActivityTableRow
                key={`${vote.voter.address}-${vote.ballot}-${i}`}
                address={vote.voter.address}
                displayName={voterEnsRecords[vote.voter.address]}
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
  displayName?: string | null;
}

function VotingActivityTableRow({
  address,
  votePower,
  voteBallot,
  displayName,
}: VotingActivityTableRowProps) {
  return (
    <tr>
      <th>
        <a
          className="hover:underline"
          href={makeEtherscanAddressURL(address)}
          target="_blank"
          rel="noreferrer"
        >
          {displayName ?? formatAddress(address)}
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
            <th className="w-72">Voter</th>

            <th>
              <span className="mr-1">Voting Power</span>
            </th>

            <th>Ballot</th>
          </tr>
        </thead>

        <tbody>
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
