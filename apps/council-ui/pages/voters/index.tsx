import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { assertNever } from "assert-never";
import Link from "next/link";
import { ReactElement } from "react";
import { getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { makeVoterURL } from "src/routes";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";

export default function Voters(): ReactElement {
  const { data: voters, status, error } = useVoterPageData();

  return (
    <Page>
      {/* Page Header */}
      <div className="flex w-full items-center gap-x-2 max-w-xl mx-auto">
        <h1 className="w-full text-5xl text-accent-content">Voters</h1>

        {/* Search Input Box */}
        <input
          type="text"
          placeholder="Search"
          className="daisy-input-bordered daisy-input w-64 max-w-xs"
        />

        {/* Filter Dropdown */}
        <div className="daisy-dropdown">
          <label tabIndex={0} className="daisy-btn daisy-btn-accent m-1">
            Filter
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
      </div>

      {(() => {
        switch (status) {
          case "loading":
            return (
              <div className="flex flex-col items-center gap-8 ">
                <p>Loading voters. This might take a while...</p>
                <Progress />
              </div>
            );
          case "error":
            return (
              <div className="daisy-mockup-code">
                <code className="block whitespace-pre-wrap px-6 text-error">
                  {error ? (error as any).toString() : "Unknown error"}
                </code>
              </div>
            );

          case "success":
            return (
              <table className="daisy-table-zebra daisy-table max-w-2xl mx-auto">
                {/* Table Header */}
                <thead>
                  <tr>
                    <th>Voter</th>
                    <th>
                      {/* purposely empty to make a space for the action button */}
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {voters.map(({ address, ensName }) => {
                    return (
                      <tr key={address}>
                        <td className="underline">
                          <Link href={makeVoterURL(address)}>
                            {ensName ? ensName : address}
                          </Link>
                        </td>
                        <td>
                          <button className="daisy-btn daisy-btn-ghost daisy-btn-sm">
                            <Link href={makeVoterURL(address)}>▹</Link>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          default:
            assertNever(status);
        }
      })()}
    </Page>
  );
}
interface VoterRowData {
  address: string;
  ensName: string | null;
  // TODO: Add `gscStatus` once we can reliably query it
  // TODO: Add `votingPower` once we can reliably query it
}

function useVoterPageData(): UseQueryResult<VoterRowData[]> {
  const {
    coreVoting,
    context: { provider },
  } = useCouncil();
  return useQuery<VoterRowData[]>({
    queryKey: ["voter-list-page"],
    queryFn: async () => {
      const voters = await coreVoting.getVoters();
      const ensRecords = await getBulkEnsRecords(
        voters.map((voter) => voter.address),
        provider,
      );

      return voters.map((voter) => ({
        address: voter.address,
        ensName: ensRecords[voter.address],
      }));
    },
    refetchOnWindowFocus: false,
  });
}
