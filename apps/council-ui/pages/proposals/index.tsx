import { Ballot, getBlockDate } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { parseEther } from "ethers/lib/utils";
import Link from "next/link";
import { ReactElement, useMemo, useState } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { makeProposalURL } from "src/routes";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useCouncil } from "src/ui/council/useCouncil";
import { useAccount } from "wagmi";

export default function ProposalsPage(): ReactElement {
  const { address } = useAccount();
  const { data, isError, isLoading, error } = useProposalsPageData(address);

  const [sortField, setSortField] = useState(SortField.CREATED);
  const sortedData = useMemo(
    () => sortProposalRowData(sortField, data),
    [sortField, data],
  );

  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-center gap-y-10 px-4">
      {/* Page Header */}
      <div className="flex w-full items-center gap-x-2">
        <h1 className="w-full text-5xl text-accent-content">Proposals</h1>

        {/* Sort Dropdown */}
        <div className="daisy-dropdown daisy-dropdown-end">
          <label tabIndex={0} className="daisy-btn daisy-btn-accent m-1">
            Sort
          </label>
          <ul
            tabIndex={0}
            className="daisy-dropdown-content daisy-menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            {Object.values(SortField).map((sortField) => (
              <li key={`proposalSortField-${sortField}`}>
                <a onClick={() => setSortField(sortField)}>{sortField}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isError ? (
        <div className="daisy-mockup-code">
          <code className="block whitespace-pre-wrap px-6 text-error">
            {error ? (error as any).toString() : "Unknown error"}
          </code>
        </div>
      ) : isLoading ? (
        <progress className="daisy-progress m-auto w-56 items-center"></progress>
      ) : (
        <ProposalsTable rowData={sortedData} />
      )}
    </div>
  );
}

interface ProposalsTableProps {
  rowData?: ProposalRowData[];
}

function ProposalsTable({ rowData }: ProposalsTableProps) {
  return (
    <table className="daisy-table-zebra daisy-table w-full min-w-fit">
      <thead>
        <tr>
          <th>Voting Contract</th>
          <th>ID</th>
          <th>Created</th>
          <th>Voting Ends</th>
          <th>Quorum</th>
          <th>Your Ballot</th>
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
          href={makeEtherscanAddressURL(votingContract)}
          target="_blank"
          rel="noreferrer"
        >
          {formatAddress(votingContract)}
        </a>
      </th>
      <td>{id}</td>
      <td>{created?.toLocaleDateString() ?? "🤷"}</td>
      <td>{votingEnds?.toLocaleDateString() ?? "🤷"}</td>
      <td>
        {formatBalance(currentQuorum, 0)} /{" "}
        {requiredQuorum ? formatBalance(requiredQuorum, 0) : "🤷"}
      </td>
      <td>{ballot ?? "🤷"}</td>
      <th>
        <button className="daisy-btn daisy-btn-ghost daisy-btn-sm">
          <Link href={makeProposalURL("0x000000000000")}>▹</Link>
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
    queryKey: ["proposalsPage", gscVoting, account],
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
  CREATED = "Created",
  QUORUM = "Quorum",
}

function sortProposalRowData(sort: SortField, data?: ProposalRowData[]) {
  if (!data) {
    return data;
  }
  switch (sort) {
    case SortField.QUORUM:
      return data.slice().sort((a, b) => +b.currentQuorum - +a.currentQuorum);
    case SortField.CREATED:
    default:
      return data.slice().sort((a, b) => {
        const aTime = a.created ? a.created.getTime() : 0;
        const bTime = b.created ? b.created.getTime() : 0;
        return bTime - aTime;
      });
  }
}
