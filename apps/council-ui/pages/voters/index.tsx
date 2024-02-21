import {
  ReadVotingVault,
  VoterPowerBreakdown,
  VoterWithPower,
} from "@delvtech/council-viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReactElement, useMemo, useState } from "react";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { Page } from "src/ui/base/Page";
import { useReadCoreVoting } from "src/ui/council/hooks/useReadCoreVoting";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useReadGscVault } from "src/ui/vaults/gscVault/hooks/useReadGscVault";
import { GSCOnlyToggle } from "src/ui/voters/GscOnlyToggle";
import { useVotersSearch } from "src/ui/voters/hooks/useVotersSearch";
import { VoterRowData } from "src/ui/voters/types";
import { VoterList } from "src/ui/voters/VoterList/VoterList";
import { VoterListSkeleton } from "src/ui/voters/VoterList/VoterListSkeleton";
import { getBulkEnsRecords } from "src/utils/getBulkEnsRecords";
import { usePublicClient } from "wagmi";

const DEFAULT_LIST_SIZE = 100;

export default function VotersPage(): ReactElement {
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
  const coreVoting = useReadCoreVoting();
  const gscVault = useReadGscVault();
  const chainId = useSupportedChainId();
  const publicClient = usePublicClient();

  return useQuery<VoterRowData[]>({
    queryKey: ["voter-list-page", chainId],
    queryFn: async () => {
      const voterPowerBreakdowns: VoterPowerBreakdown[] = [];

      for (const vault of coreVoting.vaults) {
        if (hasVotingPowerBreakdown(vault)) {
          const breakdown = await vault.getVotingPowerBreakdown();
          voterPowerBreakdowns.push(...breakdown);
        }
      }

      const mergedBreakdowns = mergeVoterPowerBreakdowns(voterPowerBreakdowns);

      const gscMembers = (await gscVault?.getVoters()) || [];
      const gscMemberAddresses = gscMembers.map(({ address }) => address);
      const ensRecords = await getBulkEnsRecords(
        voterPowerBreakdowns.map(({ voter }) => voter.address),
        publicClient,
      );

      console.log({
        voterPowerBreakdowns,
        mergedBreakdowns,
        ensRecords,
      });

      return mergedBreakdowns.map(
        ({ voter, votingPower, votingPowerByDelegator }) => {
          return {
            address: voter.address,
            ensName: ensRecords[voter.address],
            votingPower,
            numberOfDelegators: votingPowerByDelegator.length,
            isGSCMember: gscMemberAddresses.includes(voter.address),
          };
        },
      );
    },

    // This is an expensive query and do not want to refetch.
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

function hasVotingPowerBreakdown(
  vault: ReadVotingVault,
): vault is ReadVotingVault & {
  getVotingPowerBreakdown: () => Promise<VoterPowerBreakdown[]>;
} {
  return (
    "getVotingPowerBreakdown" in vault &&
    typeof vault.getVotingPowerBreakdown === "function"
  );
}

// TODO: This was a method on the old Voting Contract type, but depended on
// vaults having an optional method. It seems like a combined voter list would
// be a common use case, so this might still belong in the SDK somewhere.
function mergeVoterPowerBreakdowns(
  breakdowns: VoterPowerBreakdown[],
): VoterPowerBreakdown[] {
  // create a temp object to merge unique addresses
  const breakdownsByVoter: Record<
    `0x${string}`,
    VoterWithPower & {
      fromDelegators: bigint;
      byDelegator: Record<`0x${string}`, VoterWithPower>;
    }
  > = {};

  for (const {
    voter,
    votingPower,
    votingPowerByDelegator,
    votingPowerFromAllDelegators,
  } of breakdowns) {
    const breakdown = breakdownsByVoter[voter.address];

    if (!breakdown) {
      // Add a breakdown for this voter in the unique list
      breakdownsByVoter[voter.address] = {
        voter,
        votingPower,
        fromDelegators: votingPowerFromAllDelegators,
        // key delegators by their address
        byDelegator: Object.fromEntries(
          votingPowerByDelegator.map((delegatorWithPower) => [
            delegatorWithPower.voter.address,
            delegatorWithPower,
          ]),
        ),
      };
    } else {
      // if a breakdown for this voter already exists, then merge with the
      // current one.
      breakdown.votingPower += votingPower;
      breakdown.fromDelegators += votingPowerFromAllDelegators;

      for (const delegatorWithPower of votingPowerByDelegator) {
        if (!breakdown.byDelegator[delegatorWithPower.voter.address]) {
          // Add the delegator with power to the breakdown in the unique list
          breakdown.byDelegator[delegatorWithPower.voter.address] =
            delegatorWithPower;
        } else {
          breakdown.byDelegator[delegatorWithPower.voter.address].votingPower +=
            delegatorWithPower.votingPower;
        }
      }
    }
  }

  return Object.values(breakdownsByVoter).map(
    ({ voter, votingPower, fromDelegators, byDelegator }) => ({
      voter,
      votingPower,
      votingPowerFromAllDelegators: fromDelegators,
      votingPowerByDelegator: Object.values(byDelegator),
    }),
  );
}
