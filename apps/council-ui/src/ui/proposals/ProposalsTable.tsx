import { Ballot } from "@council/sdk";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ReactElement, useMemo, useState } from "react";
import { makeProposalURL } from "src/routes";
import {
  SortableGridTable,
  SortOptions,
} from "src/ui/base/tables/SortableGridTable";
import { ProposalStatus } from "./ProposalStatus";

export interface ProposalRowData {
  ballot: Ballot | null;
  created: Date | null;
  currentQuorum: string;
  id: number;
  requiredQuorum: string | null;
  votingContractAddress: string;
  votingContractName: string;
  votingEnds: Date | null;
  sentenceSummary?: string;
}

interface ProposalsTableProps {
  rowData: ProposalRowData[];
}

export function ProposalsTable({ rowData }: ProposalsTableProps): ReactElement {
  const [sortOptions, setSortOptions] = useState<SortOptions<SortField>>({
    direction: "DESC",
    key: "votingEnds",
  });

  const sortedData = useMemo(
    () => sortProposalRowData(sortOptions, rowData),
    [sortOptions, rowData],
  );

  return (
    <SortableGridTable
      headingRowClassName="grid-cols-[4fr_1fr_1fr_1fr_56px]"
      bodyRowClassName="group grid-cols-[4fr_1fr_1fr_1fr_56px] items-center"
      onSort={setSortOptions}
      cols={[
        "Name",
        {
          cell: "Voting Ends",
          sortKey: "votingEnds",
        },
        {
          cell: "Quorum",
          sortKey: "quorum",
        },
        "Your Ballot",
        "", // extra column for the chevron
      ]}
      rows={sortedData.map(
        ({
          ballot,
          currentQuorum,
          id,
          requiredQuorum,
          votingContractAddress,
          votingContractName,
          votingEnds,
          sentenceSummary,
        }) => ({
          href: makeProposalURL(votingContractAddress, id),
          cells: [
            <span key={`${id}-name`}>
              {votingContractName} Proposal {id}
              {sentenceSummary && (
                <p className="opacity-60 text-sm">
                  {sentenceSummary.length > 80
                    ? `${sentenceSummary.slice(0, 80)}\u2026` // unicode for horizontal ellipses
                    : sentenceSummary}
                </p>
              )}
            </span>,

            votingEnds?.toLocaleDateString() ?? <em>unknown</em>,

            <ProposalStatus
              key={`${id}-status`}
              currentQuorum={currentQuorum}
              requiredQuorum={requiredQuorum}
              votingEnds={votingEnds}
              proposalId={id}
            />,

            ballot ?? <em>Not voted</em>,

            <ChevronRightIcon
              key={`${id}-chevron`}
              className="w-6 h-6 transition-all stroke-current opacity-40 group-hover:opacity-100"
            />,
          ],
        }),
      )}
    />
  );
}

type SortField = "votingEnds" | "quorum";

function sortProposalRowData(
  { direction = "DESC", key = "votingEnds" }: SortOptions<SortField>,
  data: ProposalRowData[],
) {
  if (key === "quorum") {
    if (direction === "ASC") {
      return data.slice().sort((a, b) => +a.currentQuorum - +b.currentQuorum);
    } else {
      return data.slice().sort((a, b) => +b.currentQuorum - +a.currentQuorum);
    }
  }
  // safe to assume the desired sort field is voting ends column
  // since there are only two sortable columns.
  else {
    if (direction === "ASC") {
      return data.slice().sort((a, b) => {
        const aTime = a.votingEnds ? a.votingEnds.getTime() : 0;
        const bTime = b.votingEnds ? b.votingEnds.getTime() : 0;
        return aTime - bTime;
      });
    } else {
      return data.slice().sort((a, b) => {
        const aTime = a.votingEnds ? a.votingEnds.getTime() : 0;
        const bTime = b.votingEnds ? b.votingEnds.getTime() : 0;
        return bTime - aTime;
      });
    }
  }
}
