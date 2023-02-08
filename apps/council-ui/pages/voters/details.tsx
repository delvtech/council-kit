import { Vote, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Page } from "src/ui/base/Page";
import { asyncFilter } from "src/ui/base/utils/asyncFilter";
import { useCouncil } from "src/ui/council/useCouncil";
import { AddressWithEtherscan } from "src/ui/ens/AdddressWithEtherscan";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import { VoterStatsRowSkeleton } from "src/ui/voters/skeletons/VoterStatsRowSkeleton";
import { VoterVaultsListSkeleton } from "src/ui/voters/skeletons/VoterVaultsListSkeleton";
import { VotingHistoryTableSkeleton } from "src/ui/voters/skeletons/VotingHistorySkeleton";
import { VoterStatsRow } from "src/ui/voters/VoterStatsRow";
import { VoterVaultsList } from "src/ui/voters/VoterVaultsList";
import { VotingHistoryTable } from "src/ui/voters/VotingHistoryTable";
import {
  getVoterDataByTokenWithDelegationVault,
  VoterDataByTokenWithDelegationVault,
} from "src/vaults/getVoterDataByTokenWithDelegationVault";
import { GSCStatus } from "src/vaults/gscVault/types";
import { useEnsName } from "wagmi";

export default function VoterDetailsPage(): ReactElement {
  const { query, replace } = useRouter();
  const { address } = query as { address: string | undefined };
  const { data: voterData, status } = useVoterData(address);

  if (!address) {
    // Replace pushes the user to another page. In this case the 404 page.
    replace("/404");
    // We return a jsx fragment in this block for correct typing of address.
    return <></>;
  }

  const numVotingVaults = calculateNumOfVotingVaults(voterData);

  return (
    <Page>
      <VoterHeader address={address} />

      {status === "success" ? (
        <VoterStatsRow
          gscStatus={voterData.gscStatus}
          proposalsCreated={voterData.proposalsCreated}
          proposalsVoted={voterData.votingHistory.length}
          votingPower={voterData.votingPower}
          percentOfTVP={voterData.percentOfTVP}
        />
      ) : (
        <VoterStatsRowSkeleton />
      )}

      <div className="flex flex-col gap-y-4">
        {status === "success" ? (
          <>
            <h2 className="text-2xl font-bold">
              Voting Vaults ({numVotingVaults})
            </h2>
            <VoterVaultsList
              address={address}
              vaultsData={voterData.voterDataByVault}
            />
          </>
        ) : (
          <>
            <h2 className="w-64 text-2xl">
              <Skeleton />
            </h2>
            <VoterVaultsListSkeleton />
          </>
        )}
      </div>

      <div className="flex flex-col w-full gap-y-4">
        <h2 className="text-2xl font-bold">
          Voting History ({voterData?.votingHistory.length ?? 0})
        </h2>
        {status === "success" ? (
          <div className="overflow-x-auto">
            <VotingHistoryTable history={voterData.votingHistory} />
          </div>
        ) : (
          <VotingHistoryTableSkeleton />
        )}
      </div>
    </Page>
  );
}

interface VoterHeaderProps {
  address: string;
}

function VoterHeader({ address }: VoterHeaderProps) {
  const { data: ens, isLoading: ensLoading } = useEnsName({
    address: getAddress(address as string),
    enabled: !!address,
  });

  if (ensLoading) {
    return (
      <div>
        <h1 className="text-5xl w-72">
          <Skeleton />
        </h1>

        <h2 className="w-48 mt-2 text-2xl">
          <Skeleton />
        </h2>
      </div>
    );
  }

  return ens ? (
    <div className="w-min">
      <h1 className="text-5xl font-bold">{ens}</h1>
      <h2 className="mt-2 text-2xl">
        <AddressWithEtherscan
          className="w-min"
          address={address}
          iconSize={24}
        />
      </h2>
    </div>
  ) : (
    <h1 className="text-5xl font-bold w-min">
      <AddressWithEtherscan address={address} iconSize={36} />
    </h1>
  );
}

interface VoterData {
  gscStatus: GSCStatus | null;
  proposalsCreated: number;
  voterDataByVault: VoterDataByTokenWithDelegationVault[];
  votingHistory: Vote[];
  votingPower: string;
  percentOfTVP: number;
}

export function useVoterData(
  address: string | undefined,
): UseQueryResult<VoterData> {
  const { context, coreVoting } = useCouncil();
  const { data: gscStatus } = useGSCStatus(address);

  const queryEnabled = !!address && !!gscStatus;
  return useQuery({
    queryKey: ["voter-details", address, gscStatus],
    enabled: queryEnabled,
    queryFn: queryEnabled
      ? async (): Promise<VoterData> => {
          const voter = new Voter(address, context);
          // display voting history in reverse chronological order, ie: most
          // recent proposals first
          // TODO: Where does GSC Voting history fit in this?
          const votingHistory = [
            ...(await voter.getVotes(coreVoting.address)),
          ].reverse();
          const votingPower = await voter.getVotingPower(
            coreVoting.vaults.map((vault) => vault.address),
          );
          const tvp = await coreVoting.getTotalVotingPower();

          const voterDataByVault = await getVoterDataByTokenWithDelegationVault(
            address,
            coreVoting,
          );

          const coreVotingProposals = await coreVoting.getProposals();
          const proposalsCreatedByAddress = await asyncFilter(
            coreVotingProposals,
            async (proposal) => {
              const createdBy = await proposal.getCreatedBy();
              return createdBy === address;
            },
          );

          return {
            votingHistory,
            votingPower,
            percentOfTVP: +((+votingPower / +tvp) * 100).toFixed(1),
            gscStatus,
            voterDataByVault,
            proposalsCreated: proposalsCreatedByAddress.length,
          };
        }
      : undefined,
    refetchOnWindowFocus: false,
  });
}

// Utility functions for this page
function calculateNumOfVotingVaults(data?: VoterData) {
  if (!data) {
    return 0;
  }

  const addGSCVault = data.gscStatus
    ? Number(["Member", "Idle"].includes(data.gscStatus as string))
    : 0;

  return data.voterDataByVault.length + addGSCVault;
}
