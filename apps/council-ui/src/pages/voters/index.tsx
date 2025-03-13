import {
  mergeVotingPowerBreakdowns,
  VotingPowerBreakdown,
} from "@delvtech/council-js";
import { Address } from "@delvtech/drift";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement, useMemo, useState } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { Page } from "src/ui/base/Page";
import { useCouncilConfig } from "src/ui/config/useCouncilConfig";
import { useReadCouncil } from "src/ui/council/useReadCouncil";
import { useSupportedChainId } from "src/ui/network/useSupportedChainId";
import { GSCOnlyToggle } from "src/ui/voters/GscOnlyToggle";
import { useSearchVoters } from "src/ui/voters/hooks/useVotersSearch";
import { VoterRowData } from "src/ui/voters/types";
import { VoterList } from "src/ui/voters/VoterList/VoterList";
import { VoterListSkeleton } from "src/ui/voters/VoterList/VoterListSkeleton";
import { getBulkEnsRecords } from "src/utils/getBulkEnsRecords";

const DEFAULT_LIST_SIZE = 100;

export default function VotersPage(): ReactElement {
  const { data: voters, status, error } = useVoterPageData();
  const { results, search } = useSearchVoters(voters);
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
      <div className="m-auto max-w-3xl space-y-10 px-4">
        <div>
          <h1 className="text-5xl font-bold">Voters</h1>
          <p className="mt-6 text-lg">
            Voters are accounts that currently have voting power. You can search
            by partial keywords using ENS names or addresses.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by ENS or address"
            className="daisy-input daisy-input-bordered w-full"
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

export function useVoterPageData(): UseQueryResult<VoterRowData[]> {
  const chainId = useSupportedChainId();
  const config = useCouncilConfig();
  const council = useReadCouncil();
  const enabled = !!council;

  return useQuery({
    queryKey: ["voter-list-page", chainId],
    // This is an expensive query and do not want to refetch.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled,
    queryFn: enabled
      ? async () => {
          const powerBreakdownPromises: Promise<VotingPowerBreakdown[]>[] = [];

          for (const { address, type } of config.coreVoting.vaults) {
            switch (type) {
              case "LockingVault":
              case "FrozenLockingVault":
                powerBreakdownPromises.push(
                  council.lockingVault(address).getVotingPowerBreakdown(),
                );
              case "VestingVault":
                powerBreakdownPromises.push(
                  council.vestingVault(address).getVotingPowerBreakdown(),
                );
            }
          }

          const powerBreakdowns = await Promise.all(powerBreakdownPromises);
          const mergedBreakdowns = mergeVotingPowerBreakdowns(
            powerBreakdowns.flat(),
          );
          const ensRecords = await getBulkEnsRecords(
            mergedBreakdowns.map(({ voter }) => voter),
            chainId,
          );

          let gscMembers: Address[] | undefined;
          if (config.gscVoting) {
            const { address } = config.gscVoting.vaults[0];
            gscMembers = await council.gscVault(address).getMembers();
          }

          return mergedBreakdowns.map(({ voter, votingPower, delegators }) => {
            return {
              address: voter,
              ensName: ensRecords[voter],
              votingPower,
              numberOfDelegators: delegators.length,
              isGSCMember: gscMembers?.includes(voter),
            };
          });
        }
      : undefined,
  });
}
