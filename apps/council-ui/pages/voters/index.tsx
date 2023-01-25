import { BuildingLibraryIcon } from "@heroicons/react/20/solid";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement, useMemo, useState } from "react";
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
  const [gscOnly, setGscOnly] = useState(false);

  const filteredResults = useMemo(() => {
    if (gscOnly) {
      return results.filter(({ isGSCMember }) => isGSCMember);
    }
    return results;
  }, [gscOnly, results]);

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

        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by ENS or address"
            className="w-full daisy-input-bordered daisy-input"
            onChange={(e) => {
              search(e.target.value as string);
            }}
            disabled={status !== "success"}
          />
          <label className="cursor-pointer daisy-label w-min whitespace-nowrap flex items-center gap-1">
            <BuildingLibraryIcon className="w-5 h-5 fill-warning mb-[2px]" />
            <span className="font-medium daisy-label-text mr-1">GSC Only</span>
            <input
              type="checkbox"
              className="daisy-toggle daisy-toggle-warning"
              checked={gscOnly}
              onChange={({ target }) => setGscOnly(target.checked)}
              disabled={status !== "success"}
            />
          </label>
        </div>

        {status === "success" ? (
          <VoterList
            voters={filteredResults}
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
    gscVoting,
    context: { provider },
  } = useCouncil();
  const chainId = useChainId();

  return useQuery<VoterRowData[]>({
    queryKey: ["voter-list-page", chainId],
    queryFn: async () => {
      const voterPowerBreakdowns = await coreVoting.getVotingPowerBreakdown();
      const gscMembers = (await gscVoting?.getVoters()) || [];
      const gscMemberAddresses = gscMembers.map(({ address }) => address);
      const ensRecords = await getBulkEnsRecords(
        voterPowerBreakdowns.map(({ voter }) => voter.address),
        provider,
      );

      return voterPowerBreakdowns.map(({ voter, votingPower, delegators }) => ({
        address: voter.address,
        ensName: ensRecords[voter.address],
        votingPower,
        numberOfDelegators: delegators.length,
        isGSCMember: gscMemberAddresses.includes(voter.address),
      }));
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
