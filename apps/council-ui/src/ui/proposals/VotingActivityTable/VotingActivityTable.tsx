import { Ballot, Vote } from "@council/sdk";
import { FixedNumber } from "ethers";
import { ReactElement, useMemo, useState } from "react";
import { EnsRecords } from "src/ens/getBulkEnsRecords";
import { makeVoterURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import {
  SortableGridTable,
  SortOptions,
} from "src/ui/base/tables/SortableGridTable";
import { VoterAddress } from "src/ui/voters/VoterAddress";
import FormattedBallot from "src/ui/voting/FormattedBallot";

type SortField = "votingPower" | "ballot";

interface VotingActivityTableProps {
  votes: Vote[];
  voterEnsRecords: EnsRecords;
}

export function VotingActivityTable({
  votes,
  voterEnsRecords,
}: VotingActivityTableProps): ReactElement {
  const [sortOptions, setSortOptions] = useState<SortOptions<SortField>>({
    key: "votingPower",
    direction: "ASC",
  });

  const sortedData = useMemo(
    () => sortVotes(sortOptions, votes),
    [sortOptions, votes],
  );

  return (
    <div className="w-full overflow-auto max-h-96">
      <SortableGridTable
        headingRowClassName="grid-cols-[2fr-1fr-1fr]"
        bodyRowClassName="grid-cols-[2fr-1fr-1fr]"
        onSort={setSortOptions}
        cols={[
          "Voter",
          {
            cell: "Voting Power",
            sortKey: "votingPower",
          },
          {
            cell: "Ballot",
            sortKey: "ballot",
          },
        ]}
        rows={sortedData.map(({ voter, power, ballot }, i) => {
          return {
            href: makeVoterURL(voter.address),
            cells: [
              <VoterAddress
                key={`${i}-address`}
                address={voter.address}
                label={voterEnsRecords[voter.address] || undefined}
              />,
              formatBalance(power),
              <FormattedBallot key={`${i}-ballot`} ballot={ballot} />,
            ],
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

function sortVotes({ key, direction }: SortOptions<SortField>, data: Vote[]) {
  switch (key) {
    case "votingPower":
      if (direction === "ASC") {
        return data
          .slice()
          .sort((a, b) =>
            FixedNumber.from(a.power)
              .subUnsafe(FixedNumber.from(b.power))
              .toUnsafeFloat(),
          );
      }
      return data
        .slice()
        .sort((a, b) =>
          FixedNumber.from(b.power)
            .subUnsafe(FixedNumber.from(a.power))
            .toUnsafeFloat(),
        );
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
