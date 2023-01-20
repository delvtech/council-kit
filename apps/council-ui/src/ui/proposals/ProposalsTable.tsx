import { Ballot } from "@council/sdk";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeProposalURL } from "src/routes";
import { ChevronRightSVG } from "src/ui/base/svg/ChevronRight";
import { DownArrowSVG } from "src/ui/base/svg/DownArrow";
import { UpArrowSVG } from "src/ui/base/svg/UpArrow";
import { MiniQuorumBar } from "src/ui/proposals/MiniQuorumBar";

export interface ProposalRowData {
  votingContractName: string;
  votingContractAddress: string;
  id: number;
  created: Date | null;
  votingEnds: Date | null;
  currentQuorum: string;
  requiredQuorum: string | null;
  ballot: Ballot | null;
}

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
          <th>Name</th>

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

export function ProposalTableSkeleton(): ReactElement {
  return (
    <table className="w-full shadow-md daisy-table-zebra daisy-table min-w-fit">
      <thead>
        <tr>
          <th className="w-72">Name</th>

          <th className="w-32">Voting Ends</th>

          <th className="w-32">
            <span className="mr-1">Quorum</span>
          </th>

          <th className="w-16">Your Ballot</th>

          <th className="w-16"></th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th>
            <Skeleton />
          </th>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
          <td>
            <Skeleton />
          </td>
        </tr>
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
