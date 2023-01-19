import { getBlockDate } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import assertNever from "assert-never";
import { parseEther } from "ethers/lib/utils";
import { ReactElement, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { ExternalInfoCard } from "src/ui/base/information/ExternalInfoCard";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import {
  ProposalSortDirection,
  ProposalSortField,
  ProposalSortOptions,
  ProposalsTable,
} from "src/ui/proposals/ProposalsTable";
import { ProposalRowData } from "src/ui/proposals/types";
import { useAccount } from "wagmi";

export default function ProposalsPage(): ReactElement {
  const { address } = useAccount();
  const { data, error, status } = useProposalsPageData(address);

  const [sortOptions, setSortOptions] = useState<ProposalSortOptions>({
    field: ProposalSortField.ID,
    direction: ProposalSortDirection.NONE,
  });

  const sortedData = useMemo(
    () => sortProposalRowData(sortOptions, data),
    [sortOptions, data],
  );

  // handle the field and direction of the sorting
  const handleSortOptionsChange = (field: ProposalSortField) => {
    // user clicked on the same field, thus changing sort direction
    if (field === sortOptions.field) {
      const newSortDirectionState = sortStates[sortOptions.direction];

      // reset to no sorting
      if (newSortDirectionState === ProposalSortDirection.NONE) {
        setSortOptions({
          field: ProposalSortField.ID,
          direction: ProposalSortDirection.NONE,
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
        direction: ProposalSortDirection.ASC,
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

// simple state machine for sort state transitions
const sortStates: Record<ProposalSortDirection, ProposalSortDirection> = {
  [ProposalSortDirection.ASC]: ProposalSortDirection.DESC,
  [ProposalSortDirection.DESC]: ProposalSortDirection.NONE,
  [ProposalSortDirection.NONE]: ProposalSortDirection.ASC,
};

function sortProposalRowData(
  sort: ProposalSortOptions,
  data?: ProposalRowData[],
) {
  if (!data) {
    return undefined;
  }

  switch (sort.field) {
    case ProposalSortField.ID:
      return data.slice().sort((a, b) => b.id - a.id);

    case ProposalSortField.QUORUM:
      if (sort.direction === ProposalSortDirection.ASC) {
        return data.slice().sort((a, b) => +b.currentQuorum - +a.currentQuorum);
      } else {
        return data.slice().sort((a, b) => +a.currentQuorum - +b.currentQuorum);
      }

    case ProposalSortField.ENDS:
    default:
      if (sort.direction === ProposalSortDirection.ASC) {
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
