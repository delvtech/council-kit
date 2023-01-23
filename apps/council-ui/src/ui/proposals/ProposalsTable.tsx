import { Ballot } from "@council/sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import { makeProposalURL } from "src/routes";
import { ChevronRightSVG } from "src/ui/base/svg/ChevronRight";
import { DownArrowSVG } from "src/ui/base/svg/DownArrow";
import { UpArrowSVG } from "src/ui/base/svg/UpArrow";
import { MiniQuorumBar } from "src/ui/proposals/MiniQuorumBar";

export interface ProposalRowData {
  ballot: Ballot | null;
  created: Date | null;
  currentQuorum: string;
  id: number;
  requiredQuorum: string | null;
  votingContractAddress: string;
  votingContractName: string;
  votingEnds: Date | null;
}

interface ProposalsTableProps {
  rowData: ProposalRowData[];
}

export function ProposalsTable({ rowData }: ProposalsTableProps): ReactElement {
  const [sortOptions, setSortOptions] = useState<ProposalSortOptions>({
    field: ProposalSortField.ENDS,
    direction: ProposalSortDirection.ASC,
  });

  const sortedData = useMemo(
    () => sortProposalRowData(sortOptions, rowData),
    [sortOptions, rowData],
  );

  const handleSortOptionsChange = (field: ProposalSortField) =>
    setSortOptions({
      field,
      direction: sortStates[sortOptions.direction],
    });

  return (
    <table className="w-full daisy-table-zebra daisy-table min-w-fit">
      <thead>
        <tr>
          <th>Name</th>

          <th
            className="cursor-pointer"
            onClick={() => handleSortOptionsChange(ProposalSortField.ENDS)}
          >
            <span className="mr-1 select-none hover:underline">
              Voting Ends
            </span>
            <SortDirectionStatus
              direction={sortOptions.direction}
              enabled={sortOptions.field === ProposalSortField.ENDS}
            />
          </th>

          <th
            className="cursor-pointer"
            onClick={() => handleSortOptionsChange(ProposalSortField.QUORUM)}
          >
            <span className="mr-1 select-none hover:underline">Quorum</span>
            <SortDirectionStatus
              direction={sortOptions.direction}
              enabled={sortOptions.field === ProposalSortField.QUORUM}
            />
          </th>

          <th>Your Ballot</th>

          {/* empty header reserved for button */}
          <th></th>
        </tr>
      </thead>

      <tbody>
        {sortedData.map((proposal) => (
          <ProposalTableRow
            {...proposal}
            key={`${proposal.votingContractName}${proposal.id}`}
          />
        ))}
      </tbody>
    </table>
  );
}

function ProposalTableRow({
  ballot,
  currentQuorum,
  id,
  requiredQuorum,
  votingContractAddress,
  votingContractName,
  votingEnds,
}: ProposalRowData) {
  const { push } = useRouter();
  return (
    <tr
      onClick={() => push(makeProposalURL(votingContractAddress, id))}
      className="hover:cursor-pointer"
    >
      <td>
        {votingContractName} Proposal {id}
      </td>

      <td>{votingEnds?.toLocaleDateString() ?? <em>unknown</em>}</td>

      <td>
        <MiniQuorumBar
          currentQuorum={currentQuorum}
          requiredQuorum={requiredQuorum}
          votingEnds={votingEnds}
        />
      </td>

      <td>{ballot ?? <em>Not voted</em>}</td>

      <td>
        <button className="daisy-btn daisy-btn-ghost daisy-btn-sm">
          <Link href={makeProposalURL(votingContractAddress, id)}>
            <ChevronRightSVG />
          </Link>
        </button>
      </td>
    </tr>
  );
}

interface SortDirectionProps {
  direction: ProposalSortDirection;
  enabled: boolean;
}

function SortDirectionStatus({ direction, enabled }: SortDirectionProps) {
  if (!enabled) {
    return null;
  }

  switch (direction) {
    case ProposalSortDirection.ASC:
      return <DownArrowSVG />;
    case ProposalSortDirection.DESC:
      return <UpArrowSVG />;
    default:
      return null;
  }
}

export enum ProposalSortField {
  ID = "ID",
  ENDS = "ENDS",
  QUORUM = "Quorum",
}

export enum ProposalSortDirection {
  ASC,
  DESC,
}

export interface ProposalSortOptions {
  field: ProposalSortField;
  direction: ProposalSortDirection;
}

// simple state machine for sort state transitions
const sortStates: Record<ProposalSortDirection, ProposalSortDirection> = {
  [ProposalSortDirection.ASC]: ProposalSortDirection.DESC,
  [ProposalSortDirection.DESC]: ProposalSortDirection.ASC,
};

function sortProposalRowData(
  sort: ProposalSortOptions,
  data: ProposalRowData[],
) {
  if (sort.field === ProposalSortField.QUORUM) {
    if (sort.direction === ProposalSortDirection.ASC) {
      return data.slice().sort((a, b) => +b.currentQuorum - +a.currentQuorum);
    } else {
      return data.slice().sort((a, b) => +a.currentQuorum - +b.currentQuorum);
    }
  }
  // safe to assume the desired sort field is voting ends column
  // since there are only two sortable columns.
  else {
    if (sort.direction === ProposalSortDirection.ASC) {
      return data.slice().sort((a, b) => {
        const aTime = a.votingEnds ? a.votingEnds.getTime() : 0;
        const bTime = b.votingEnds ? b.votingEnds.getTime() : 0;
        return bTime - aTime;
      });
    } else {
      return data.slice().sort((a, b) => {
        const aTime = a.votingEnds ? a.votingEnds.getTime() : 0;
        const bTime = b.votingEnds ? b.votingEnds.getTime() : 0;
        return aTime - bTime;
      });
    }
  }
}
