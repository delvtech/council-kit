import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement, useState } from "react";
import { getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { useVotersSearch } from "src/ui/voters/hooks/useVotersSearch";
import { VoterRowData } from "src/ui/voters/types";
import { VoterList } from "src/ui/voters/VoterList/VoterList";
import { VoterListSkeleton } from "src/ui/voters/VoterList/VoterListSkeleton";

const DEFAULT_LIST_SIZE = 100;

export default function Voters(): ReactElement {
  const { data: voters, status, error } = useVoterPageData();
  const { results, search } = useVotersSearch(voters);
  const [listSize, setListSize] = useState(DEFAULT_LIST_SIZE);

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  return (
    <Page>
      <div className="flex flex-col max-w-3xl mx-auto gap-y-8">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold">Voters</h1>
          <p className="mt-6 text-lg">
            Voters are accounts that currently have voting power. You can search
            by partial keywords using ENS names or addresses.
          </p>
        </div>

        {status === "success" ? (
          <input
            type="text"
            placeholder="Search by ENS or address"
            className="w-full daisy-input-bordered daisy-input"
            onChange={(e) => {
              search(e.target.value as string);
            }}
          />
        ) : (
          <input
            type="text"
            placeholder="Search by ENS or address"
            className="w-full daisy-input-bordered daisy-input"
            disabled
          />
        )}

        {status === "success" ? (
          <VoterList
            voters={results}
            size={listSize}
            onSizeChange={(newSize) => setListSize(newSize)}
          />
        ) : (
          <VoterListSkeleton />
        )}
      </div>
    </Page>
  );
}

function useVoterPageData(): UseQueryResult<VoterRowData[]> {
  const {
    coreVoting,
    context: { provider },
  } = useCouncil();
  const chainId = useChainId();

  return useQuery<VoterRowData[]>({
    queryKey: ["voter-list-page", chainId],
    queryFn: async () => {
      const votersWithPower = await coreVoting.getVotersWithVotingPower();
      const ensRecords = await getBulkEnsRecords(
        votersWithPower.map(({ voter }) => voter.address),
        provider,
      );

      return votersWithPower.map(({ voter, votingPower }) => ({
        address: voter.address,
        ensName: ensRecords[voter.address],
        votingPower,
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
