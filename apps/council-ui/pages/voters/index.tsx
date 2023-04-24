import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Image from "next/image";
import { ReactElement, useMemo, useState } from "react";
import { getBulkEnsRecords } from "src/ens/getBulkEnsRecords";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useChainId } from "src/ui/network/useChainId";
import { GSCOnlyToggle } from "src/ui/voters/GSCOnlyToggle";
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
      <div className="max-w-3xl px-4 m-auto space-y-10">
        <div>
          <h1 className="text-5xl font-bold">Voters</h1>
          <p className="mt-6 text-lg">
            Voters are accounts that currently have voting power. You can search
            by partial keywords using ENS names or addresses.
          </p>
        </div>

        <a
          className="flex items-center gap-2 px-5 py-3 bg-[#222432] border border-[#1A1D2D] rounded-lg"
          href="https://element.karmahq.xyz/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="grow text-[#C7CADF] text-sm">
            See more details including snapshot and forum activity on Karma
          </span>
          <Image
            src="/karma-logo-dark.svg"
            alt="Karma"
            width={80}
            height={20}
          />
          <ChevronRightIcon fill="#626890" width={24} />
        </a>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by ENS or address"
            className="w-full daisy-input-bordered daisy-input"
            onChange={(e) => search(e.target.value as string)}
            disabled={status !== "success"}
          />
          <GSCOnlyToggle
            on={gscOnly}
            onToggle={setGscOnly}
            disabled={status !== "success"}
          />
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

    // This is an expensive query and do not want to refetch.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}
