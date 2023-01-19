import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { makeProposalURL } from "src/routes";
import { ChevronRightSVG } from "src/ui/base/svg/ChevronRight";
import { DownArrowSVG } from "src/ui/base/svg/DownArrow";
import { UpArrowSVG } from "src/ui/base/svg/UpArrow";
import { MiniQuorumBar } from "src/ui/proposals/MiniQuorumBar";
import { ProposalRowData } from "src/ui/proposals/types";

interface ProposalsTableProps {
  rowData?: ProposalRowData[];
  sortOptions: ProposalSortOptions;
  onSortOptionsChange: (field: ProposalSortField) => void;
}

export function ProposalsTable({
  rowData,
  sortOptions,
  onSortOptionsChange,
}: ProposalsTableProps): ReactElement {
  return (
    <table className="w-full daisy-table-zebra daisy-table min-w-fit">
      <thead>
        <tr>
          <th>Voting Contract</th>

          <th
            className="cursor-pointer"
            onClick={() => onSortOptionsChange(ProposalSortField.ENDS)}
          >
            <span className="mr-1 select-none hover:underline">
              Voting Ends
            </span>
            {sortOptions.field === ProposalSortField.ENDS && (
              <SortDirectionStatus direction={sortOptions.direction} />
            )}
          </th>

          <th
            className="cursor-pointer"
            onClick={() => onSortOptionsChange(ProposalSortField.QUORUM)}
          >
            <span className="mr-1 select-none hover:underline">Quorum</span>
            {sortOptions.field === ProposalSortField.QUORUM && (
              <SortDirectionStatus direction={sortOptions.direction} />
            )}
          </th>

          <th>Your Ballot</th>

          <th></th>
        </tr>
      </thead>

      <tbody>
        {rowData &&
          rowData.map((proposal) => (
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
  votingContractAddress,
  votingContractName,
  id,
  votingEnds,
  currentQuorum,
  requiredQuorum,
  ballot,
}: ProposalRowData) {
  const { push } = useRouter();

  return (
    <tr
      onClick={() => push(makeProposalURL(votingContractAddress, id))}
      className="hover:cursor-pointer"
    >
      <th>
        {votingContractName} Proposal {id}
      </th>
      <td>{votingEnds?.toLocaleDateString() ?? <em>unknown</em>}</td>
      <td>
        <MiniQuorumBar
          currentQuorum={currentQuorum}
          requiredQuorum={requiredQuorum}
          votingEnds={votingEnds}
        />
      </td>
      <td>{ballot ?? <em>Not voted</em>}</td>
      <th>
        <button className="daisy-btn daisy-btn-ghost daisy-btn-sm">
          <Link href={makeProposalURL(votingContractAddress, id)}>
            <ChevronRightSVG />
          </Link>
        </button>
      </th>
    </tr>
  );
}

export enum ProposalSortField {
  ID = "ID",
  ENDS = "ENDS",
  QUORUM = "Quorum",
}

export enum ProposalSortDirection {
  ASC,
  DESC,
  NONE,
}

export interface ProposalSortOptions {
  field: ProposalSortField;
  direction: ProposalSortDirection;
}

function SortDirectionStatus({
  direction,
}: {
  direction: ProposalSortDirection;
}) {
  switch (direction) {
    case ProposalSortDirection.ASC:
      return <DownArrowSVG />;
    case ProposalSortDirection.DESC:
      return <UpArrowSVG />;
    default:
      return null;
  }
}
