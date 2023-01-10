import { Ballot, Vote } from "@council/sdk";
import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { EnsRecords } from "src/ens/getBulkEnsRecords";
import { makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { WalletIcon } from "src/ui/base/WalletIcon";
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
        <Link
          className="hover:underline flex items-center"
          href={makeVoterURL(address)}
        >
          <WalletIcon address={address} className="mr-2" />
          {displayName ?? formatAddress(address)}
        </Link>
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
