import { Ballot, getBlockDate, Proposal } from "@council/sdk";
import Link from "next/link";
import { ReactElement } from "react";
import { makeEtherscanHref } from "src/paths/makeEtherscanHref";
import { makeProposalHref } from "src/routing/makeRoute";
import { useCouncil } from "src/ui/council/useCouncil";
import { formatAddress } from "src/ui/utils/formatAddress";
import { useAccount, useQuery } from "wagmi";
import { UseQueryResult } from "wagmi/dist/declarations/src/hooks/utils";

export default function Proposals(): ReactElement {
  const { address } = useAccount();
  const { data, isError, isLoading, error } = useProposalsPageData(address);
  return (
    <div className="m-auto mt-16 flex max-w-5xl flex-col items-center gap-y-10 px-4">
      {/* Page Header */}
      <div className="flex w-full items-center gap-x-2">
        <h1 className="w-full text-5xl">Proposals</h1>
        {/* Sort Dropdown */}
        <div className="daisy-dropdown">
          <label tabIndex={0} className="daisy-btn-accent daisy-btn m-1">
            Sort
          </label>
          <ul
            tabIndex={0}
            className="daisy-dropdown-content daisy-menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>

        {/* Add Proposal Button */}
        {/* <button className="p-4 daisy-btn-outline daisy-btn daisy-btn-circle">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0"
              y1="20"
              x2="40"
              y2="20"
              strokeWidth={5}
              className="stroke-primary-content"
            ></line>
            <line
              x1="20"
              y1="0"
              x2="20"
              y2="40"
              strokeWidth={5}
              className="stroke-primary-content"
            ></line>
          </svg>
        </button> */}
      </div>

      {/* Voters Table */}
      <table className="daisy-table-zebra daisy-table w-full min-w-fit">
        {/* Table Header */}
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

        {/* Table Body */}
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={7}>Loading...</td>
            </tr>
          )}
          {isError && !isLoading && (
            <tr>
              <td colSpan={7}>
                <div className="mockup-code">
                  <pre className="text-error">
                    <code>{error as string}</code>
                  </pre>
                </div>
              </td>
            </tr>
          )}
          {data &&
            !isLoading &&
            !isError &&
            data.map(
              ({
                votingContract,
                id,
                created,
                votingEnds,
                requiredQuorum,
                currentQuorum,
                ballot,
              }) => (
                <tr key={`${votingContract}${id}`}>
                  <th>
                    <a
                      href={makeEtherscanHref(votingContract)}
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
                    {currentQuorum} / {requiredQuorum}
                  </td>
                  <td>{ballot}</td>
                  <th>
                    <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                      <Link href={makeProposalHref("0x000000000000")}>▹</Link>
                    </button>
                  </th>
                </tr>
              ),
            )}
        </tbody>
      </table>
    </div>
  );
}

interface ProposalRowData {
  votingContract: string;
  id: number;
  created: Date | null;
  votingEnds: Date | null;
  currentQuorum: string;
  requiredQuorum: string | null;
  ballot: Ballot;
}

function useProposalsPageData(
  account: string | undefined,
): UseQueryResult<ProposalRowData[], unknown> {
  const { context, coreVoting, gscVoting } = useCouncil();
  return useQuery(["proposalsPage", account], {
    enabled: !!account,
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
          const { ballot } = await proposal.getVote(account as string);
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
            ballot: ballot,
          };
        }),
      );
    },
  });
}
