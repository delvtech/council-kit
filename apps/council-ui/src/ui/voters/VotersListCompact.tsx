import { VoterWithPower } from "@council/sdk";
import { ReactElement, useMemo, useState } from "react";
import { makeVoterURL } from "src/routes";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import {
  SortableGridTable,
  SortOptions,
} from "src/ui/base/tables/SortableGridTable";
import { useBulkEnsRecords } from "src/ui/ens/useBulkEnsRecords";
import { VoterAddress } from "src/ui/voters/VoterAddress";

interface VotersListCompactProps {
  voters: VoterWithPower[];
}

export function VotersListCompact({
  voters,
}: VotersListCompactProps): ReactElement {
  const [sortOptions, setSortOptions] = useState<SortOptions<"votingPower">>({
    key: "votingPower",
    direction: "DESC",
  });

  const sortedVoters = useMemo(() => {
    let sorted = voters.slice();
    const { key, direction } = sortOptions;

    if (direction) {
      switch (key) {
        case "votingPower":
        default:
          sorted = voters
            .slice()
            .sort((a, b) => +a.votingPower - +b.votingPower);
          break;
      }

      if (direction === "DESC") {
        sorted.reverse();
      }
    }

    return sorted;
  }, [sortOptions, voters]);

  const { data: ensRecords } = useBulkEnsRecords(
    voters.map(({ voter }) => voter.address),
  );

  return (
    <SortableGridTable
      headingRowClassName="[&>*]:px-4 [&>*]:py-2"
      bodyRowClassName="[&>*]:px-4 [&>*]:py-2 text-sm font-semibold"
      striped={false}
      cols={[
        "wallet",
        {
          cell: "delegated power",
          sortKey: "votingPower",
        },
      ]}
      defaultSortOptions={sortOptions}
      onSort={setSortOptions}
      rows={sortedVoters.map(({ voter, votingPower }) => {
        return {
          href: makeVoterURL(voter.address),
          cells: [
            <VoterAddress
              key="address"
              address={voter.address}
              ensName={ensRecords?.[voter.address]}
            />,
            formatBalance(votingPower, 0),
          ],
        };
      })}
    />
  );
}
