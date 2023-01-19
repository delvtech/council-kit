import { Ballot, getBlockDate } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import classNames from "classnames";
import { parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { makeProposalURL } from "src/routes";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { ChevronRightSVG } from "src/ui/base/svg/ChevronRight";
import { DownArrowSVG } from "src/ui/base/svg/DownArrow";
import { UpArrowSVG } from "src/ui/base/svg/UpArrow";
import { useCouncil } from "src/ui/council/useCouncil";
import { useAccount } from "wagmi";

export default function ProposalsPage(): ReactElement {
  const { address } = useAccount();
  const { data, error, status } = useProposalsPageData(address);

  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: SortField.ID,
    direction: SortDirection.NONE,
  });

  const sortedData = useMemo(
    () => sortProposalRowData(sortOptions, data),
    [sortOptions, data],
  );

  // handle the field and direction of the sorting
  const handleSortOptionsChange = (field: SortField) => {
    // user clicked on the same field, thus changing sort direction
    if (field === sortOptions.field) {
      const newSortDirectionState = sortStates[sortOptions.direction];

      // reset to no sorting
      if (newSortDirectionState === SortDirection.NONE) {
        setSortOptions({
          field: SortField.ID,
          direction: SortDirection.NONE,
        });
      } else {
        setSortOptions({
          field,
          direction: newSortDirectionState,
        });
      }
    } else {
      // user clicked a new field, starting the sorting at ascending
      setSortOptions({
        field,
        direction: SortDirection.ASC,
      });
    }
  };

  return (
    <Page>
      <h1 className="text-5xl font-bold">Proposals</h1>

      {(() => {
        switch (status) {
          case "loading":
            return (
              <div className="w-full">
                <SkeletonProposalTable />
              </div>
            );

          case "error":
            return (
              <div className="daisy-mockup-code">
                <code className="block px-6 whitespace-pre-wrap text-error">
                  {error ? (error as string).toString() : "Unknown error"}
                </code>
              </div>
            );

          case "success":
            return (
              <div className="w-full">
                <ProposalsTable
                  rowData={sortedData}
                  sortOptions={sortOptions}
                  onSortOptionsChange={handleSortOptionsChange}
                />
              </div>
            );
          default:
            assertNever(status);
        }
      })()}

      <div className="flex flex-wrap gap-4 md:flex-nowrap">
        <ExternalInfoCard
          header="Check out our docs to learn more about the proposal process."
          body="Click to dive deeper into proposals in Council. "
          href="#"
        />
        <ExternalInfoCard
          header="Learn to create your own on-chain proposals"
          body="Proposals are necessary for any critical governance actions to be executed."
          href="#"
        />
      </div>
    </Page>
  );
}

interface ProposalsTableProps {
  rowData?: ProposalRowData[];
  sortOptions: SortOptions;
  onSortOptionsChange: (field: SortField) => void;
}

function SortDirectionStatus({ direction }: { direction: SortDirection }) {
  switch (direction) {
    case SortDirection.ASC:
      return <DownArrowSVG />;
    case SortDirection.DESC:
      return <UpArrowSVG />;
    default:
      return null;
  }
}

function ProposalsTable({
  rowData,
  sortOptions,
  onSortOptionsChange,
}: ProposalsTableProps) {
  return (
    <table className="w-full daisy-table-zebra daisy-table min-w-fit">
      <thead>
        <tr>
          <th>Voting Contract</th>

          <th
            className="cursor-pointer"
            onClick={() => onSortOptionsChange(SortField.ENDS)}
          >
            <span className="mr-1 select-none hover:underline">
              Voting Ends
            </span>
            {sortOptions.field === SortField.ENDS && (
              <SortDirectionStatus direction={sortOptions.direction} />
            )}
          </th>

          <th
            className="cursor-pointer"
            onClick={() => onSortOptionsChange(SortField.QUORUM)}
          >
            <span className="mr-1 select-none hover:underline">Quorum</span>
            {sortOptions.field === SortField.QUORUM && (
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

interface MiniQuorumBarProps {
  currentQuorum: string;
  requiredQuorum: string | null;
  votingEnds: Date | null;
}
function MiniQuorumBar({
  currentQuorum,
  requiredQuorum,
  votingEnds,
}: MiniQuorumBarProps) {
  const currentDate = new Date();

  if (!requiredQuorum) {
    if (votingEnds && currentDate > votingEnds) {
      return (
        <progress
          className="w-full daisy-progress daisy-progress-error"
          value={100}
          max={100}
        />
      );
    }
    return <progress className="w-full daisy-progress" value={0} max={100} />;
  }

  const hasPassedQuorum = +currentQuorum >= +requiredQuorum;

  if (votingEnds && currentDate > votingEnds && !hasPassedQuorum) {
    return (
      <progress
        className="w-full daisy-progress daisy-progress-error"
        value={100}
        max={100}
      />
    );
  }

  return (
    <progress
      className={classNames("w-full daisy-progress daisy-progress-info", {
        "daisy-progress-success": hasPassedQuorum,
      })}
      value={currentQuorum}
      max={requiredQuorum}
    />
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

interface ProposalRowData {
  votingContractName: string;
  votingContractAddress: string;
  id: number;
  created: Date | null;
  votingEnds: Date | null;
  currentQuorum: string;
  requiredQuorum: string | null;
  ballot: Ballot | null;
}

function useProposalsPageData(
  account: string | undefined,
): UseQueryResult<ProposalRowData[]> {
  const { context, coreVoting, gscVoting } = useCouncil();
  return useQuery({
    queryKey: ["proposalsPage", account],
    queryFn: async () => {
      let allProposals = await coreVoting.getProposals();

      if (gscVoting) {
        const gscProposals = await gscVoting.getProposals();
        allProposals = [...allProposals, ...gscProposals];
      }

      return await Promise.all(
        allProposals.map(async (proposal) => {
          const createdBlock = await proposal.getCreatedBlock();
          const expirationBlock = await proposal.getExpirationBlock();
          const vote = account ? await proposal.getVote(account) : null;
          return {
            votingContractAddress: proposal.votingContract.address,
            votingContractName: proposal.votingContract.name,
            id: proposal.id,
            created:
              createdBlock &&
              (await getBlockDate(createdBlock, context.provider)),
            votingEnds:
              expirationBlock &&
              (await getBlockDate(expirationBlock, context.provider, {
                estimateFutureDates: true,
              })),
            currentQuorum: await proposal.getCurrentQuorum(),
            requiredQuorum: await proposal.getRequiredQuorum(),
            ballot: vote && parseEther(vote.power).gt(0) ? vote.ballot : null,
          };
        }),
      );
    },
  });
}

enum SortField {
  ID = "ID",
  ENDS = "ENDS",
  QUORUM = "Quorum",
}

enum SortDirection {
  ASC,
  DESC,
  NONE,
}

interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

// simple state machine for sort state transitions
const sortStates: Record<SortDirection, SortDirection> = {
  [SortDirection.ASC]: SortDirection.DESC,
  [SortDirection.DESC]: SortDirection.NONE,
  [SortDirection.NONE]: SortDirection.ASC,
};

function sortProposalRowData(sort: SortOptions, data?: ProposalRowData[]) {
  if (!data) {
    return undefined;
  }

  switch (sort.field) {
    case SortField.ID:
      return data.slice().sort((a, b) => b.id - a.id);

    case SortField.QUORUM:
      if (sort.direction === SortDirection.ASC) {
        return data.slice().sort((a, b) => +b.currentQuorum - +a.currentQuorum);
      } else {
        return data.slice().sort((a, b) => +a.currentQuorum - +b.currentQuorum);
      }

    case SortField.ENDS:
    default:
      if (sort.direction === SortDirection.ASC) {
        return data.slice().sort((a, b) => {
          const aTime = a.created ? a.created.getTime() : 0;
          const bTime = b.created ? b.created.getTime() : 0;
          return bTime - aTime;
        });
      } else {
        return data.slice().sort((a, b) => {
          const aTime = a.created ? a.created.getTime() : 0;
          const bTime = b.created ? b.created.getTime() : 0;
          return aTime - bTime;
        });
      }
  }
}

function SkeletonProposalTable() {
  return (
    <table className="w-full shadow-md daisy-table-zebra daisy-table min-w-fit">
      <thead>
        <tr>
          <th className="w-48">Voting Contract</th>

          <th className="w-16">
            <span className="mr-1">ID</span>
          </th>

          <th className="w-32">
            <span className="mr-1">Created</span>
          </th>

          <th className="w-32">Voting Ends</th>

          <th className="w-64">
            <span className="mr-1">Quorum</span>
          </th>

          <th>Your Ballot</th>

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
