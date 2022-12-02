import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { assertNever } from "assert-never";
import Fuse from "fuse.js";
import Link from "next/link";
import { ReactElement, useMemo, useState } from "react";
import { getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { makeVoterURL } from "src/routes";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { useCouncil } from "src/ui/council/useCouncil";

const MAX_LIST_SIZE = 125;

export default function Voters(): ReactElement {
  const { data: voters, status, error, isLoading } = useVoterPageData();
  const { results, search } = useVoterSearch(voters);

  return (
    <Page>
      <div className="flex flex-col max-w-xl mx-auto gap-y-8">
        {/* Page Header */}
        <div className="flex w-full items-center gap-x-2">
          <h1 className="w-full text-5xl text-accent-content">Voters</h1>
        </div>

        {/* Search Input Box */}
        {!isLoading && (
          <input
            type="text"
            placeholder="Search by ens or address"
            className="daisy-input-bordered daisy-input w-96 max-w-xs"
            onChange={(e) => {
              search(e.target.value as string);
            }}
          />
        )}

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
                    {error ? (error as string).toString() : "Unknown error"}
                  </code>
                </div>
              );

            case "success":
              return (
                <table className="daisy-table-zebra daisy-table w-full min-w-[250px] mb-10">
                  {/* Table Header */}
                  <thead>
                    <tr>
                      <th>Voter</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="my-4">
                    {results
                      .slice(0, MAX_LIST_SIZE)
                      .map(({ address, ensName }) => {
                        return (
                          <tr key={address}>
                            <td className="underline sm:px-8 md:text-lg">
                              <Link href={makeVoterURL(address)}>
                                {ensName ? ensName : address}
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>

                  {results.length > MAX_LIST_SIZE && (
                    <tfoot>
                      <div className="py-8">
                        Only loading the first {MAX_LIST_SIZE} voters. Please
                        refine search to load more.
                      </div>
                    </tfoot>
                  )}
                </table>
              );
            default:
              assertNever(status);
          }
        })()}
      </div>{" "}
    </Page>
  );
}
interface VoterRowData {
  address: string;
  ensName: string | null;
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

const voterSearchFuseOptions = {
  threshold: 0.3,
  isCaseSensitive: false,
  ignoreLocation: true,
  keys: ["address", "ensName"],
};

function useVoterSearch(data: Array<VoterRowData> | undefined) {
  const [input, setInput] = useState<string | null>(null);

  const searchCache = useMemo<Record<string, Array<VoterRowData>>>(() => {
    // blows the cache when data is changed
    return {};
  }, [data]);

  const results = useMemo(() => {
    const fuse = new Fuse(data ?? [], voterSearchFuseOptions);

    if (input) {
      if (searchCache[input]) {
        console.log("cache hit");
        return searchCache[input];
      }

      const filtered = fuse.search(input).map((item) => item.item);
      searchCache[input] = filtered;

      return filtered;
    }

    return data ?? [];
  }, [input, data]);

  return {
    results,
    reset: () => setInput(""),
    search: (i: string) => setInput(i),
  };
}
