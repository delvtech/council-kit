import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Fuse from "fuse.js";
import Link from "next/link";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { makeVoterURL } from "src/routes";
import { Page } from "src/ui/base/Page";
import { WalletIcon } from "src/ui/base/WalletIcon";
import { useCouncil } from "src/ui/council/useCouncil";

const MAX_LIST_SIZE = 125;

export default function Voters(): ReactElement {
  const { data: voters, status, error, isLoading } = useVoterPageData();
  const { results, search } = useVoterSearch(voters);

  if (status === "error") {
    return (
      <div className="daisy-mockup-code">
        <code className="block px-6 whitespace-pre-wrap text-error">
          {error ? (error as string).toString() : "Unknown error"}
        </code>
      </div>
    );
  }

  return (
    <Page>
      <div className="flex flex-col max-w-xl mx-auto gap-y-8">
        <div className="flex items-center w-full gap-x-2">
          <h1 className="w-full text-5xl font-bold text-center">Voters</h1>
        </div>

        {status === "success" ? (
          <input
            type="text"
            placeholder="Search by ens or address"
            className="w-full daisy-input-bordered daisy-input"
            onChange={(e) => {
              search(e.target.value as string);
            }}
          />
        ) : (
          <input
            type="text"
            placeholder="Search by ens or address"
            className="w-full daisy-input-bordered daisy-input"
            disabled
          />
        )}

        {status === "success" ? (
          <VoterList voters={results} />
        ) : (
          <VoterListSkeleton />
        )}
      </div>
    </Page>
  );
}

interface VoterListProps {
  voters: VoterRowData[];
}

export function VoterList({ voters }: VoterListProps): ReactElement {
  return (
    <table className="daisy-table-zebra daisy-table w-full min-w-[250px] mb-10">
      <thead>
        <tr>
          <th>Voter</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="my-4">
        {voters.slice(0, MAX_LIST_SIZE).map(({ address, ensName }) => {
          return (
            <tr key={address}>
              <td className="underline sm:px-8 md:text-lg">
                <Link
                  href={makeVoterURL(address)}
                  className="flex items-center"
                >
                  <WalletIcon address={address} className="mr-2" />
                  {ensName ? ensName : address}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>

      {voters.length > MAX_LIST_SIZE && (
        <tfoot>
          <div className="py-8">
            Only loading the first {MAX_LIST_SIZE} voters. Please refine search
            to load more.
          </div>
        </tfoot>
      )}
    </table>
  );
}

export function VoterListSkeleton(): ReactElement {
  return (
    <table className="daisy-table-zebra daisy-table w-full min-w-[250px]">
      <thead>
        <tr>
          <th className="w-[420px]">Voter</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>

        <tr>
          <th>
            <Skeleton />
          </th>
        </tr>
      </tbody>
    </table>
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

  const searchCache = useRef<Record<string, Array<VoterRowData>>>({});
  useEffect(() => {
    searchCache.current = {};
  }, [data]);

  const results = useMemo(() => {
    const fuse = new Fuse(data ?? [], voterSearchFuseOptions);

    if (input) {
      if (searchCache.current[input]) {
        return searchCache.current[input];
      }

      const filtered = fuse.search(input).map((item) => item.item);
      searchCache.current[input] = filtered;

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
