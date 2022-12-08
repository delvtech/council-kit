import { Ballot, getBlockDate } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { ReactElement, useMemo, useState } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { makeProposalURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Progress } from "src/ui/base/Progress";
import { ChevronRightSVG } from "src/ui/base/svg/ChevronRight";
import { DownArrowSVG } from "src/ui/base/svg/DownArrow";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
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
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-start gap-y-10 px-4">
      <h1 className="text-5xl">Proposals</h1>

      {(() => {
        switch (status) {
          case "loading":
            return (
              <div className="flex flex-col items-center gap-8 ">
                <p>Loading proposals. This might take a while...</p>
                <Progress />
              </div>
            );

          case "error":
            return (
              <div className="daisy-mockup-code">
                <code className="block whitespace-pre-wrap px-6 text-error">
                  {error ? (error as string).toString() : "Unknown error"}
                </code>
              </div>
            );

          case "success":
            return (
              <div>
                <ProposalsTable
                  rowData={sortedData}
                  sortOptions={sortOptions}
                  onSortOptionsChange={handleSortOptionsChange}
                />

                <div className="flex mt-8 gap-4 flex-wrap md:flex-nowrap">
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
              </div>
            );
          default:
            assertNever(status);
        }
      })()}
    </div>
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
    <table className="daisy-table-zebra daisy-table w-full min-w-fit shadow-md">
      <thead>
        <tr>
          <th className="select-none">Voting Contract</th>

          <th className="select-none">
            <span className="mr-1 select-none">ID</span>
          </th>

          <th
            className="cursor-pointer select-none hover:opacity-60"
            onClick={() => onSortOptionsChange(SortField.CREATED)}
          >
            <span className="mr-1">Created</span>
            {sortOptions.field === SortField.CREATED && (
              <SortDirectionStatus direction={sortOptions.direction} />
            )}
          </th>

          <th className="select-none">Voting Ends</th>

          <th
            className="cursor-pointer select-none hover:opacity-60"
            onClick={() => onSortOptionsChange(SortField.QUORUM)}
          >
            <span className="mr-1">Quorum</span>
            {sortOptions.field === SortField.QUORUM && (
              <SortDirectionStatus direction={sortOptions.direction} />
            )}
          </th>

          <th className="select-none">Your Ballot</th>

          <th></th>
        </tr>
      </thead>

      <tbody>
        {rowData &&
          rowData.map((proposal) => (
            <ProposalTableRow
              {...proposal}
              key={`${proposal.votingContract}${proposal.id}`}
            />
          ))}
      </tbody>
    </table>
  );
}

function ProposalTableRow({
  votingContract,
  id,
  created,
  votingEnds,
  currentQuorum,
  requiredQuorum,
  ballot,
}: ProposalRowData) {
  return (
    <tr>
      <th>
        <a
          className="hover:underline"
          href={makeEtherscanAddressURL(votingContract)}
          target="_blank"
          rel="noreferrer"
        >
          {formatAddress(votingContract)}
          <ExternalLinkSVG size={16} />
        </a>
      </th>
      <td>{id}</td>
      <td>{created?.toLocaleDateString() ?? "🤷"}</td>
      <td>{votingEnds?.toLocaleDateString() ?? "🤷"}</td>
      <td>
        {requiredQuorum
          ? `${formatBalance(currentQuorum, 0)} / ${formatBalance(
              requiredQuorum,
              0,
            )} `
          : "🤷"}
      </td>
      <td>{ballot ?? "🤷"}</td>
      <th>
        <button className="daisy-btn daisy-btn-ghost daisy-btn-sm">
          <Link href={makeProposalURL(votingContract, id)}>
            <ChevronRightSVG />
          </Link>
        </button>
      </th>
    </tr>
  );
}

interface ProposalRowData {
  votingContract: string;
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
            votingContract: proposal.votingContract.address,
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
  CREATED = "Created",
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

    case SortField.CREATED:
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
