import { Ballot, ReadVote } from "@delvtech/council-viem";
import { ReactElement, ReactNode, useMemo, useState } from "react";
import { makeVoterURL } from "src/routes";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import {
  Column,
  SortOptions,
  SortableGridTable,
} from "src/ui/base/tables/SortableGridTable";
import { VoterAddress } from "src/ui/voters/VoterAddress";
import FormattedBallot from "src/ui/voting/FormattedBallot";
import { EnsRecords } from "src/utils/getBulkEnsRecords";

type SortField = "votingPower" | "ballot";

interface VotingActivityTableProps {
  votes: ReadVote[];
  voterEnsRecords: EnsRecords;
  /**
   * Whether to show the voting power used by each voter.
   * @default true
   */
  showVotingPower?: boolean;
}

export function VotingActivityTable({
  votes,
  voterEnsRecords,
  showVotingPower = true,
}: VotingActivityTableProps): ReactElement {
  const [sortOptions, setSortOptions] = useState<SortOptions<SortField>>({
    key: "votingPower",
    direction: "ASC",
  });

  const sortedData = useMemo(
    () => sortVotes(sortOptions, votes),
    [sortOptions, votes],
  );

  const cols = useMemo(() => {
    const cols: Column<SortField>[] = ["Voter"];

    if (showVotingPower) {
      cols.push({
        cell: "Voting Power",
        sortKey: "votingPower",
      });
    }

    cols.push({
      cell: "Ballot",
      sortKey: "ballot",
    });

    return cols;
  }, [showVotingPower]);

  return (
    <div className="max-h-96 w-full overflow-auto">
      <SortableGridTable
        headingRowClassName={
          showVotingPower ? "grid-cols-[2fr_1fr_1fr]" : "grid-cols-[2fr_1fr]"
        }
        bodyRowClassName={
          showVotingPower ? "grid-cols-[2fr_1fr_1fr]" : "grid-cols-[2fr_1fr]"
        }
        onSort={setSortOptions}
        cols={cols}
        rows={sortedData.map(({ voter, power, ballot }, i) => {
          const cells: ReactNode[] = [
            <VoterAddress
              key={`${i}-address`}
              address={voter.address}
              label={voterEnsRecords[voter.address] || undefined}
            />,
          ];
          if (showVotingPower) {
            cells.push(formatVotingPower(power));
          }
          cells.push(<FormattedBallot key={`${i}-ballot`} ballot={ballot} />);
          return {
            href: makeVoterURL(voter.address),
            cells,
          };
        })}
      />
    </div>
  );
}

// Descending will go from positive -> negative sentiment
const ballotSortIndexes: Record<Ballot, number> = {
  yes: 2,
  maybe: 1,
  no: 0,
};

function sortVotes(
  { key, direction }: SortOptions<SortField>,
  data: ReadVote[],
) {
  switch (key) {
    case "votingPower":
      if (direction === "ASC") {
        return data.slice().sort((a, b) => (a.power >= b.power ? 1 : -1));
      }
      return data.slice().sort((a, b) => (b.power >= a.power ? 1 : -1));
    case "ballot":
      if (direction === "ASC") {
        return data
          .slice()
          .sort(
            (a, b) => ballotSortIndexes[a.ballot] - ballotSortIndexes[b.ballot],
          );
      }
      return data
        .slice()
        .sort(
          (a, b) => ballotSortIndexes[b.ballot] - ballotSortIndexes[a.ballot],
        );
    default:
      return data;
  }
}
