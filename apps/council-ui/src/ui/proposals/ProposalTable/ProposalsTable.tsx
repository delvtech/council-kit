import { Ballot } from "@council/sdk";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import { ReactElement, useMemo, useState } from "react";
import { formatTimeLeft } from "src/dates/formatTimeLeft";
import { ProposalStatus } from "src/proposals/getProposalStatus";
import { makeProposalURL } from "src/routes";
import {
  SortableGridTable,
  SortOptions,
} from "src/ui/base/tables/SortableGridTable";
import { Tooltip } from "src/ui/base/Tooltip/Tooltip";
import { tooltipByStatus } from "src/ui/proposals/tooltips";
import FormattedBallot from "src/ui/voting/FormattedBallot";
import { useAccount } from "wagmi";

export interface ProposalRowData {
  status: ProposalStatus;
  ballot: Ballot | null;
  created: Date | null;
  currentQuorum: string;
  id: number;
  votingContractAddress: string;
  votingContractName: string;
  votingEnds: Date | null;
  sentenceSummary?: string;
  title?: string;
}

interface ProposalsTableProps {
  rowData: ProposalRowData[];
}

export function ProposalsTable({ rowData }: ProposalsTableProps): ReactElement {
  const { address: account } = useAccount();
  const [sortOptions, setSortOptions] = useState<SortOptions<SortField>>({
    direction: "DESC",
    key: "votingEnds",
  });

  const sortedData = useMemo(
    () => sortProposalRowData(sortOptions, rowData),
    [sortOptions, rowData],
  );

  return (
    <>
      <div className="hidden md:block">
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
              cell: "Status",
              sortKey: "status",
            },
            "Your Ballot",
            "", // extra column for the chevron
          ]}
          rows={sortedData.map(
            ({
              status,
              ballot,
              id,
              votingContractAddress,
              votingContractName,
              votingEnds,
              sentenceSummary,
              title,
            }) => ({
              href: makeProposalURL(votingContractAddress, id),
              cells: [
                <span key={`${id}-name`}>
                  {title ?? `${votingContractName} Proposal ${id}`}
                  {sentenceSummary && (
                    <p className="text-sm opacity-60">
                      {sentenceSummary.length > 80
                        ? `${sentenceSummary.slice(0, 80)}\u2026` // unicode for horizontal ellipses
                        : sentenceSummary}
                    </p>
                  )}
                </span>,

                votingEnds ? formatTimeLeft(votingEnds) : <em>unknown</em>,

                <StatusBadge key={`${id}-status`} status={status} />,

                ballot ? (
                  <FormattedBallot ballot={ballot} />
                ) : account ? (
                  <em>Not voted</em>
                ) : (
                  <em>Not connected</em>
                ),

                <ChevronRightIcon
                  key={`${id}-chevron`}
                  className="w-6 h-6 transition-all stroke-current opacity-40 group-hover:opacity-100"
                />,
              ],
            }),
          )}
        />
      </div>
      <div className="md:hidden flex flex-col gap-6">
        {sortedData.map(
          (
            {
              status,
              ballot,
              id,
              votingContractAddress,
              votingContractName,
              votingEnds,
              sentenceSummary,
              title,
            },
            i,
          ) => (
            <Link
              key={i}
              href={makeProposalURL(votingContractAddress, id)}
              className="daisy-card bg-base-200 hover:shadow-xl transition-shadow"
            >
              <div className="daisy-card-body justify-between">
                <h3 className="text-2xl daisy-card-title">
                  {title ?? `${votingContractName} Proposal ${id}`}
                </h3>
                {sentenceSummary && (
                  <p className="opacity-60">
                    {sentenceSummary.length > 80
                      ? `${sentenceSummary.slice(0, 80)}\u2026` // unicode for horizontal ellipses
                      : sentenceSummary}
                  </p>
                )}
                <div className="mt-4 grid grid-flow-col auto-cols-fr border-t border-base-300">
                  <div className=" px-4 py-2 flex flex-col justify-center border-r border-base-300">
                    <span className="text-sm opacity-60">Status</span>
                    <StatusBadge status={status} />
                  </div>
                  <div className=" px-4 py-2 flex flex-col justify-center">
                    <span className="text-sm opacity-60">Your Ballot</span>
                    {ballot ? (
                      <FormattedBallot ballot={ballot} />
                    ) : account ? (
                      <em>Not voted</em>
                    ) : (
                      <em>Not connected</em>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </>
  );
}

type SortField = "votingEnds" | "status";

function sortProposalRowData(
  { direction = "DESC", key = "votingEnds" }: SortOptions<SortField>,
  data: ProposalRowData[],
) {
  if (key === "status") {
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

function StatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <Tooltip content={tooltipByStatus[status]}>
      <div
        className={classNames("font-bold daisy-badge", {
          "daisy-badge-error": status === "FAILED",
          "daisy-badge-info": status === "IN PROGRESS",
          "daisy-badge-success": status === "EXECUTED",
          "daisy-badge-warning": status === "EXPIRED",
        })}
      >
        {status}
      </div>
    </Tooltip>
  );
}
