import { Ballot, Vote } from "@council/sdk";
import { FixedNumber } from "ethers";
import Link from "next/link";
import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { EnsRecords } from "src/ens/getBulkEnsRecords";
import { makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { DownArrowSVG } from "src/ui/base/svg/DownArrow";
import { UpArrowSVG } from "src/ui/base/svg/UpArrow";
import { asyncFilter } from "src/ui/base/utils/asyncFilter";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { useCouncil } from "src/ui/council/useCouncil";
import FormattedBallot from "src/ui/voting/FormattedBallot";

interface VotingActivityTableProps {
  votes: Vote[];
  voterEnsRecords: EnsRecords;
}

const SortFieldOptions = ["VotingPower"] as const;
type SortField = typeof SortFieldOptions[number];

const SortDirectionOptions = ["ASC", "DESC"] as const;
type SortDirection = typeof SortDirectionOptions[number];

interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

export function VotingActivityTable({
  votes,
  voterEnsRecords,
}: VotingActivityTableProps): ReactElement {
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "VotingPower",
    direction: "ASC",
  });

  const { gscVoting } = useCouncil();

  const [gscOnly, setGscOnly] = useState(false);

  const [filteredVotes, setFilteredVotes] = useState(votes);

  const sortedData = useMemo(
    () => sortVotes(sortOptions, filteredVotes),
    [sortOptions, filteredVotes],
  );

  useEffect(() => {
    if (gscOnly && gscVoting) {
      asyncFilter(votes, (vote) =>
        gscVoting.getIsMember(vote.voter.address),
      ).then((filteredVotes) => setFilteredVotes(filteredVotes));
    } else {
      // reset filter
      setFilteredVotes(votes);
    }
  }, [gscOnly]);

  const handleSortOptionsChange = (field: SortField) =>
    setSortOptions({
      field,
      direction: sortStates[sortOptions.direction],
    });

  return (
    <div className="flex flex-col gap-y-2">
      <label className="mb-2 cursor-pointer daisy-label w-fit">
        <span className="mr-2 font-medium daisy-label-text">GSC Only</span>
        <input
          type="checkbox"
          className="daisy-toggle daisy-toggle-warning"
          checked={gscOnly}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setGscOnly(event.target.checked);
          }}
        />
      </label>

      <div className="w-full overflow-auto max-h-96">
        <table className="w-full daisy-table-zebra daisy-table">
          <thead>
            <tr>
              <th>Voter</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSortOptionsChange("VotingPower")}
              >
                <span className="mr-1 select-none hover:underline">
                  Voting Power
                </span>
                <SortDirectionStatus
                  direction={sortOptions.direction}
                  enabled={sortOptions.field === "VotingPower"}
                />
              </th>
              <th>Ballot</th>
            </tr>
          </thead>

          <tbody className="h-24 overflow-auto">
            {sortedData.map((vote, i) => (
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
          className="flex items-center daisy-link daisy-link-hover"
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

interface SortDirectionProps {
  direction: SortDirection;
  enabled: boolean;
}

function SortDirectionStatus({ direction, enabled }: SortDirectionProps) {
  if (!enabled) {
    return null;
  }

  switch (direction) {
    case "ASC":
      return <DownArrowSVG />;
    case "DESC":
      return <UpArrowSVG />;
    default:
      return null;
  }
}

// simple state machine for sort state transitions
const sortStates: Record<SortDirection, SortDirection> = {
  ["ASC"]: "DESC",
  ["DESC"]: "ASC",
};

function sortVotes(sort: SortOptions, data: Vote[]) {
  if (sort.field === "VotingPower") {
    if (sort.direction === "ASC") {
      return data
        .slice()
        .sort((a, b) =>
          FixedNumber.from(b.power)
            .subUnsafe(FixedNumber.from(a.power))
            .toUnsafeFloat(),
        );
    }

    return data
      .slice()
      .sort((a, b) =>
        FixedNumber.from(a.power)
          .subUnsafe(FixedNumber.from(b.power))
          .toUnsafeFloat(),
      );
  }

  return data;
}
