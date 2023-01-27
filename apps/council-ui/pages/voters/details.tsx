import { Vote, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { Address } from "src/ui/base/Address";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import {
  VoterStatsRow,
  VoterStatsRowSkeleton,
} from "src/ui/voters/VoterStatsRow";
import { VoterVaultsList } from "src/ui/voters/VoterVaultsList";
import { VoterVaultsListSkeleton } from "src/ui/voters/VoterVaultsListSkeleton";
import { VotingHistoryTableSkeleton } from "src/ui/voters/VotingHistorySkeleton";
import { VotingHistoryTable } from "src/ui/voters/VotingHistoryTable";
import {
  getVoterDataByVault,
  VoterDataByVault,
} from "src/vaults/getVoterDataByVault";
import { GSCStatus } from "src/vaults/gscVault";
import { useEnsName } from "wagmi";

export default function VoterDetailsPage(): ReactElement {
  const { query } = useRouter();
  const { address } = query as { address: string | undefined };

  const { data, status } = useVoterData(address);

  if (!address) {
    return (
      <ErrorMessage error="No address provided or address is malformed." />
    );
  }

  return (
    <Page>
      <VoterHeader address={address} />

      {status === "success" ? (
        <VoterStatsRow
          gscStatus={data.gscStatus}
          proposalsVoted={data.votingHistory.length}
          votingPower={data.votingPower}
        />
      ) : (
        <VoterStatsRowSkeleton />
      )}

      {status === "success" ? (
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">
            Voting Vaults ({data.voterDataByVault.length})
          </h2>
          <VoterVaultsList
            address={address}
            vaultData={data.voterDataByVault}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <h2 className="w-64 text-2xl">
            <Skeleton />
          </h2>
          <VoterVaultsListSkeleton />
        </div>
      )}

      <div className="flex flex-col w-full gap-y-4">
        <h2 className="text-2xl font-bold">
          Voting History ({data?.votingHistory.length ?? 0})
        </h2>
        {status === "success" ? (
          <div className="overflow-x-auto">
            <VotingHistoryTable history={data.votingHistory} />
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
    <div>
      <h1 className="w-full text-5xl font-bold">{ens}</h1>
      <a
        href={makeEtherscanAddressURL(address)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <h2 className="flex items-center w-full mt-2 text-2xl">
          <Address address={address} iconSize={24} />
        </h2>
      </a>
    </div>
  ) : (
    <h1 className="w-full mt-2 text-5xl">
      <Address address={address} iconSize={36} />
    </h1>
  );
}

interface VoterData {
  votingHistory: Vote[];
  votingPower: string;
  gscStatus: GSCStatus | null;
  voterDataByVault: VoterDataByVault[];
}

export function useVoterData(
  address: string | undefined,
): UseQueryResult<VoterData> {
  const { context, coreVoting } = useCouncil();
  const { data: gscStatus } = useGSCStatus(address);

  const queryEnabled = !!address;
  return useQuery({
    queryKey: ["voter-stats", address, gscStatus],
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
          const voterDataByVault = await getVoterDataByVault(
            address,
            coreVoting,
          );

          return {
            votingHistory,
            votingPower,
            gscStatus: gscStatus ?? null,
            voterDataByVault,
          };
        }
      : undefined,
    refetchOnWindowFocus: false,
  });
}
