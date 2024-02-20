import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactElement, useMemo, useState } from "react";
import { makeVoterURL } from "src/routes";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import {
  SortableGridTable,
  SortOptions,
} from "src/ui/base/tables/SortableGridTable";
import { useDelegatesByVault } from "src/ui/vaults/hooks/useDelegatesByVault";
import { VoterRowData } from "src/ui/voters/types";
import { VoterAddress } from "src/ui/voters/VoterAddress";

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
  const [sortOptions, setSortOptions] = useState<SortOptions<SortField>>({
    key: "votingPower",
    direction: "DESC",
  });

  const { delegatesByVault = {} } = useDelegatesByVault();
  // Memoized to prevent invalidating sortedVoters on every render.
  const delegateAddresses = useMemo(
    () => Object.values(delegatesByVault).map(({ address }) => address),
    [delegatesByVault],
  );

  const { sortedDelegates, sortedVoters } = useMemo(() => {
    let sorted = voters;
    const { key, direction } = sortOptions;

    if (direction) {
      switch (key) {
        case "numberOfDelegators":
          sorted = voters
            .slice()
            .sort((a, b) => a.numberOfDelegators - b.numberOfDelegators);
          break;

        case "votingPower":
        default:
          sorted = voters
            .slice()
            .sort((a, b) => (a.votingPower >= b.votingPower ? 1 : -1));
          break;
      }

      if (direction === "DESC") {
        sorted.reverse();
      }
    }

    return {
      sortedDelegates: sorted.filter(({ address }) =>
        delegateAddresses.includes(address),
      ),
      sortedVoters: sorted.filter(
        ({ address }) => !delegateAddresses.includes(address),
      ),
    };
  }, [sortOptions, voters, delegateAddresses]);

  return (
    <div className="min-w-[250px]">
      <SortableGridTable
        headingRowClassName="grid-cols-[1.5fr_1fr_1fr_56px]"
        bodyRowClassName="group grid-cols-[1.5fr_1fr_1fr_56px]"
        emptyTableElement={
          <h2 className="mt-4 text-center text-lg">No voters to show</h2>
        }
        onSort={setSortOptions}
        defaultSortOptions={sortOptions}
        cols={[
          "Voter",
          {
            cell: "# of Delegators",
            sortKey: "numberOfDelegators",
          },
          {
            cell: "Voting Power",
            sortKey: "votingPower",
          },
          "", // extra column for the chevron
        ]}
        rows={[
          ...sortedDelegates.map(
            ({ address, ensName, votingPower, numberOfDelegators }, i) => {
              const isLastDelegate = i === sortedDelegates.length - 1;
              return {
                href: makeVoterURL(address),
                cells: [
                  <VoterAddress
                    key={address}
                    address={address}
                    ensName={ensName}
                  />,
                  numberOfDelegators,
                  formatVotingPower(votingPower, 0),
                  <span key={`${address}-chevron`}>
                    <ChevronRightIcon className="size-6 stroke-current opacity-40 transition-all group-hover:opacity-100" />
                  </span>,
                ],
                className: isLastDelegate
                  ? "border-b border-accent"
                  : undefined,
              };
            },
          ),

          ...sortedVoters
            .slice(0, size - sortedDelegates.length)
            .map(({ address, ensName, votingPower, numberOfDelegators }) => {
              return {
                href: makeVoterURL(address),
                cells: [
                  <VoterAddress
                    key={address}
                    address={address}
                    ensName={ensName}
                  />,
                  numberOfDelegators,
                  formatVotingPower(votingPower, 0),
                  <span key={`${address}-chevron`}>
                    <ChevronRightIcon className="size-6 stroke-current opacity-40 transition-all group-hover:opacity-100" />
                  </span>,
                ],
              };
            }),
        ]}
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
