import { Ballot, ReadCoreVoting } from "@delvtech/council-js";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import { ReactElement, useMemo, useState } from "react";
import { makeProposalURL } from "src/routes";
import { Tooltip } from "src/ui/base/Tooltip";
import {
  SortOptions,
  SortableGridTable,
} from "src/ui/base/tables/SortableGridTable";
import { useCouncilConfig } from "src/ui/config/hooks/useCouncilConfig";
import { tooltipByStatus } from "src/ui/proposals/tooltips";
import FormattedBallot from "src/ui/voting/FormattedBallot";
import { formatTimeLeft } from "src/utils/formatTimeLeft";
import { ProposalStatus } from "src/utils/getProposalStatus";
import { useAccount } from "wagmi";

export interface ProposalRowData {
  status: ProposalStatus;
  ballot: Ballot | undefined;
  id: bigint;
  votingContract: ReadCoreVoting;
  votingEnds: Date | undefined;
  sentenceSummary?: string;
  title?: string;
}

interface ProposalsTableProps {
  rowData: ProposalRowData[];
}

export function ProposalsTable({ rowData }: ProposalsTableProps): ReactElement {
  const { address: account } = useAccount();
  const config = useCouncilConfig();
  const [sortOptions, setSortOptions] = useState<SortOptions<SortField>>({
    direction: "DESC",
    key: "votingEnds",
  });

  const sortedData = useMemo(
    () => sortProposalRowData(sortOptions, rowData),
    [sortOptions, rowData],
  );

  const contractNamesByAddress = {
    [config.coreVoting.address]: config.coreVoting.name,
    [config.gscVoting?.address || "0x"]: config.gscVoting?.name || "Unknown",
  };

  return (
    <>
      {/* Desktop */}
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
              id,
              title,
              sentenceSummary,
              status,
              votingEnds,
              ballot,
              votingContract,
            }) => {
              return {
                href: makeProposalURL(votingContract.address, id),
                cells: [
                  <span key={`${id}-name`}>
                    {title ??
                      `${contractNamesByAddress[votingContract.address]} Proposal ${id}`}
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
                    className="size-6 stroke-current opacity-40 transition-all group-hover:opacity-100"
                  />,
                ],
              };
            },
          )}
        />
      </div>

      {/* Mobile */}
      <div className="flex h-full flex-col gap-6 md:hidden">
        {!sortedData.length ? (
          <div className="bg-base-200 rounded-b-lg p-10 text-center">
            <p className="text-lg">Nothing to show.</p>
          </div>
        ) : (
          sortedData.map(
            (
              { status, ballot, id, votingContract, sentenceSummary, title },
              i,
            ) => (
              <Link
                key={i}
                href={makeProposalURL(votingContract.address, id)}
                className="daisy-card bg-base-200 transition-shadow hover:shadow-xl"
              >
                <div className="daisy-card-body justify-between">
                  <h3 className="daisy-card-title text-2xl">
                    {title ??
                      `${contractNamesByAddress[votingContract.address]} Proposal ${id}`}
                  </h3>
                  {sentenceSummary && (
                    <p className="opacity-60">
                      {sentenceSummary.length > 80
                        ? `${sentenceSummary.slice(0, 80)}\u2026` // unicode for horizontal ellipses
                        : sentenceSummary}
                    </p>
                  )}
                  <div className="border-base-300 mt-4 grid auto-cols-fr grid-flow-col border-t">
                    <div className="border-base-300 flex flex-col justify-center border-r px-4 py-2">
                      <span className="text-sm opacity-60">Status</span>
                      <StatusBadge status={status} />
                    </div>
                    <div className="flex flex-col justify-center px-4 py-2">
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
          )
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
  switch (key) {
    case "status":
      switch (direction) {
        case "ASC":
          return data.slice().sort((a, b) => (b.status >= a.status ? 1 : -1));

        case "DESC":
          return data.slice().sort((a, b) => (a.status >= b.status ? 1 : -1));
      }

    case "votingEnds":
      switch (direction) {
        case "ASC":
          return data.slice().sort((a, b) => {
            const aTime = a.votingEnds ? a.votingEnds.getTime() : 0;
            const bTime = b.votingEnds ? b.votingEnds.getTime() : 0;
            return aTime - bTime;
          });

        case "DESC":
          return data.slice().sort((a, b) => {
            const aTime = a.votingEnds ? a.votingEnds.getTime() : 0;
            const bTime = b.votingEnds ? b.votingEnds.getTime() : 0;
            return bTime - aTime;
          });
      }

    default:
      return data;
  }
}

function StatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <Tooltip content={tooltipByStatus[status]}>
      <div
        className={classNames("daisy-badge font-bold", {
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
