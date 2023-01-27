import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactElement, useMemo, useState } from "react";
import { makeVoterURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import {
  SortableGridTable,
  SortOptions,
} from "src/ui/base/tables/SortableGridTable";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { VoterRowData } from "src/ui/voters/types";

type SortField = "numberOfDelegators" | "votingPower";

interface VoterListProps {
  voters: VoterRowData[];
  size: number;
  onSizeChange: (newSize: number) => void;
}

export function VoterList({
  voters,
  size,
  onSizeChange,
}: VoterListProps): ReactElement {
  const [sortOptions, setSortOptions] = useState<SortOptions<SortField>>({});

  const sortedVoters = useMemo(() => {
    const { key, direction } = sortOptions;

    if (!direction) {
      return voters;
    }

    let sorted;
    switch (key) {
      case "numberOfDelegators":
        sorted = voters
          .slice()
          .sort((a, b) => a.numberOfDelegators - b.numberOfDelegators);
        break;

      case "votingPower":
      default:
        sorted = voters.slice().sort((a, b) => +a.votingPower - +b.votingPower);
        break;
    }

    return direction === "ASC" ? sorted : sorted.reverse();
  }, [sortOptions, voters]);

  return (
    <div className="min-w-[250px]">
      <SortableGridTable
        headingRowClassName="grid-cols-[1.5fr_1fr_1fr_56px]"
        bodyRowClassName="group grid-cols-[1.5fr_1fr_1fr_56px]"
        onSort={setSortOptions}
        cols={[
          "Voter",
          {
            name: "# of Delegators",
            sortKey: "numberOfDelegators",
          },
          {
            name: "Voting Power",
            sortKey: "votingPower",
          },
          "", // extra column for the chevron
        ]}
        rows={sortedVoters
          .slice(0, size)
          .map(
            ({
              address,
              ensName,
              votingPower,
              numberOfDelegators,
              isGSCMember,
            }) => ({
              href: makeVoterURL(address),
              cells: [
                <span key={address} className="flex items-center">
                  <WalletIcon address={address} className="mr-2" />
                  {ensName ? ensName : formatAddress(address)}
                  {isGSCMember && (
                    <Tooltip content="GSC Member">
                      <BuildingLibraryIcon className="w-5 h-5 ml-1 fill-warning" />
                    </Tooltip>
                  )}
                </span>,
                numberOfDelegators,
                formatBalance(votingPower, 0),
                <span key={`${address}-chevron`}>
                  <ChevronRightIcon className="w-6 h-6 transition-all stroke-current opacity-40 group-hover:opacity-100" />
                </span>,
              ],
            }),
          )}
      />

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
