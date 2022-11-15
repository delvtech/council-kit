import { Proposal } from "@council/sdk";
import Link from "next/link";
import { ReactElement } from "react";
import { makeProposalHref } from "src/routing/makeRoute";
import { useCouncil } from "src/ui/council/useCouncil";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export default function Proposals(): ReactElement {
  const { data } = useProposalsPageData();
  console.log({ data });
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
          <tr>
            <th className="underline">0x000...000</th>
            <td>1</td>
            <td>Jan 1st, 2023</td>
            <td>Jan 7nd, 2023</td>
            <td>500,000 / 1.1m</td>
            <td>YES</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href={makeProposalHref("0x000000000000")}>▹</Link>
              </button>
            </th>
          </tr>

          <tr>
            <th className="underline">0x000...000</th>
            <td>1</td>
            <td>Jan 1st, 2023</td>
            <td>Jan 7nd, 2023</td>
            <td>500,000 / 1.1m</td>
            <td>YES</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href={makeProposalHref("0x000000000000")}>▹</Link>
              </button>
            </th>
          </tr>

          <tr>
            <th className="underline">0x000...000</th>
            <td>1</td>
            <td>Jan 1st, 2023</td>
            <td>Jan 7nd, 2023</td>
            <td>500,000 / 1.1m</td>
            <td>YES</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href={makeProposalHref("0x000000000000")}>▹</Link>
              </button>
            </th>
          </tr>

          <tr>
            <th className="underline">0x000...000</th>
            <td>1</td>
            <td>Jan 1st, 2023</td>
            <td>Jan 7nd, 2023</td>
            <td>500,000 / 1.1m</td>
            <td>YES</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href={makeProposalHref("0x000000000000")}>▹</Link>
              </button>
            </th>
          </tr>

          <tr>
            <th className="underline">0x000...000</th>
            <td>1</td>
            <td>Jan 1st, 2023</td>
            <td>Jan 7nd, 2023</td>
            <td>500,000 / 1.1m</td>
            <td>YES</td>
            <th>
              <button className="daisy-btn-ghost daisy-btn-sm daisy-btn">
                <Link href={makeProposalHref("0x000000000000")}>▹</Link>
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function useProposalsPageData(): UseQueryResult<Proposal[], unknown> {
  const council = useCouncil();
  return useQuery(["proposalsPage"], {
    queryFn: () => council.coreVoting.getProposals(),
  });
}
