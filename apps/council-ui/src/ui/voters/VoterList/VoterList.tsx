import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactElement, useMemo, useState } from "react";
import { makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import {
  SortDirection,
  toggleSortDirection,
} from "src/ui/base/sorting/sortDirection";
import { SortDirectionStatus } from "src/ui/base/sorting/SortDirectionStatus";
import { GridTableHeader } from "src/ui/base/tables/GridTableHeader";
import { GridTableRowLink } from "src/ui/base/tables/GridTableRowLink";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { VoterRowData } from "src/ui/voters/types";

interface VoterListProps {
  voters: VoterRowData[];
  size: number;
  onSizeChange: (newSize: number) => void;
  defaultSortField?: SortField;
  defaultSortDirection?: SortDirection;
}

export function VoterList({
  voters,
  size,
  onSizeChange,
  defaultSortField,
  defaultSortDirection,
}: VoterListProps): ReactElement {
  const [sortField, setSortField] = useState<SortField | undefined>(
    defaultSortField,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
    defaultSortDirection,
  );

  const sortedVoters = useMemo(
    () =>
      // don't sort if no sort direction is selected (no default sort).
      sortDirection ? sortVoters(voters, sortField, sortDirection) : voters,
    [voters, sortField, sortDirection],
  );

  function handleSortOptionsChange(field: SortField) {
    // toggle the direction if the same field is chosen, otherwise reset
    const startingDirection = field === sortField ? sortDirection : undefined;
    setSortDirection(toggleSortDirection(startingDirection));
    setSortField(field);
  }

  return (
    <div className="min-w-[250px]">
      <GridTableHeader className="grid-cols-[1.5fr_1fr_1fr_56px]">
        <span>Voter</span>
        <button
          className="text-left flex items-center gap-1 hover:bg-base-300"
          onClick={() => handleSortOptionsChange("numberOfDelegators")}
        >
          # of Delegators
          {sortField === "numberOfDelegators" && (
            <SortDirectionStatus direction={sortDirection} />
          )}
        </button>
        <button
          className="text-left flex items-center gap-1 hover:bg-base-300"
          onClick={() => handleSortOptionsChange("votingPower")}
        >
          Voting Power
          {sortField === "votingPower" && (
            <SortDirectionStatus direction={sortDirection} />
          )}
        </button>
        <span></span>
      </GridTableHeader>

      {sortedVoters
        .slice(0, size)
        .map(
          ({
            address,
            ensName,
            votingPower,
            numberOfDelegators,
            isGSCMember,
          }) => {
            return (
              <GridTableRowLink
                key={address}
                href={makeVoterURL(address)}
                className="group grid-cols-[1.5fr_1fr_1fr_56px]"
              >
                <span className="flex items-center">
                  <WalletIcon address={address} className="mr-2" />
                  {ensName ? ensName : formatAddress(address)}
                  {isGSCMember && (
                    <Tooltip content="GSC Member">
                      <BuildingLibraryIcon className="w-5 h-5 ml-1 fill-warning" />
                    </Tooltip>
                  )}
                </span>
                <span>{numberOfDelegators}</span>
                <span>{formatBalance(votingPower, 0)}</span>
                <span>
                  <ChevronRightIcon className="w-6 h-6 transition-all stroke-current opacity-40 group-hover:opacity-100" />
                </span>
              </GridTableRowLink>
            );
          },
        )}

      {voters.length > size && (
        <div className="flex flex-col justify-center gap-4 py-8 text-center">
          <div className="font-medium">
            Only showings {size} voters, click to load more or refine using
            search.
          </div>
          <button
            className="daisy-btn daisy-btn-primary"
            onClick={() => onSizeChange(size + 50)}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

type SortField = "numberOfDelegators" | "votingPower";

function sortVoters(
  voters: VoterRowData[],
  field: SortField | undefined,
  direction: SortDirection = "DESC",
) {
  let sorted = voters;

  switch (field) {
    case "numberOfDelegators":
      sorted = voters
        .slice()
        .sort((a, b) => a.numberOfDelegators - b.numberOfDelegators);
      break;

    case "votingPower":
      sorted = voters.slice().sort((a, b) => +a.votingPower - +b.votingPower);
  }

  return direction === "ASC" ? sorted : sorted.reverse();
}
