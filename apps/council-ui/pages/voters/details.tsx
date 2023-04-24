import { Vote, Voter } from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeEtherscanAddressURL } from "src/etherscan/makeEtherscanAddressURL";
import { Routes } from "src/routes";
import { Breadcrumbs } from "src/ui/base/Breadcrumbs";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { Page } from "src/ui/base/Page";
import { asyncFilter } from "src/ui/base/utils/asyncFilter";
import { useCouncil } from "src/ui/council/useCouncil";
import { AddressWithEtherscan } from "src/ui/ens/AdddressWithEtherscan";
import { useChainId } from "src/ui/network/useChainId";
import { useGSCStatus } from "src/ui/vaults/gscVault/useGSCStatus";
import { VoterStatsRowSkeleton } from "src/ui/voters/skeletons/VoterStatsRowSkeleton";
import { VoterStatsRow } from "src/ui/voters/VoterStatsRow";
import { VoterVaultsList } from "src/ui/voters/VoterVaultsList";
import { VoterVaultsListSkeleton } from "src/ui/voters/VoterVaultsListSkeleton";
import { VotingHistoryTableSkeleton } from "src/ui/voters/VotingHistorySkeleton";
import { VotingHistoryTable } from "src/ui/voters/VotingHistoryTable";
import { GSCStatus } from "src/vaults/gscVault/types";
import { useEnsName } from "wagmi";

export default function VoterDetailsPage(): ReactElement {
  const { query } = useRouter();
  const { address } = query as { address: string | undefined };
  const { coreVoting } = useCouncil();
  const { data, status } = useVoterData(address);
  const displayName = useDisplayName(address);

  if (!address) {
    return (
      <ErrorMessage error="No address provided or address is malformed." />
    );
  }

  const numVotingVaults =
    coreVoting.vaults.length +
    (["Member", "Idle"].includes(data?.gscStatus as string) ? 1 : 0);

  return (
    <Page>
      <div className="space-y-2">
        <Breadcrumbs
          crumbs={[{ href: Routes.VOTERS, content: "All voters" }]}
          currentPage={displayName}
        />
        <VoterHeader address={address} />
      </div>

      {status === "success" ? (
        <VoterStatsRow
          gscStatus={data.gscStatus}
          proposalsCreated={data.proposalsCreated}
          proposalsVoted={data.votingHistory.length}
          votingPower={data.votingPower}
          percentOfTVP={data.percentOfTVP}
          karmaProfile={{
            name: displayName || formatAddress(address),
            url: `https://element.karmahq.xyz/profile/${address}#votinghistory`,
          }}
        />
      ) : (
        <VoterStatsRowSkeleton />
      )}

      {status === "success" ? (
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">
            Voting Vaults ({numVotingVaults})
          </h2>
          <VoterVaultsList address={address} />
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
  const chainId = useChainId();
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

  return (
    <div className="flex items-center justify-between">
      {ens ? (
        <div className="w-fit">
          <h1 className="text-5xl font-bold">{ens}</h1>
          <a
            href={makeEtherscanAddressURL(address, chainId)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <h2 className="mt-2 text-2xl">
              <AddressWithEtherscan address={address} iconSize={24} />
            </h2>
          </a>
        </div>
      ) : (
        <h1 className="mt-2 text-5xl w-fit">
          <AddressWithEtherscan address={address} iconSize={36} />
        </h1>
      )}
      {/* <a
        className="flex items-center gap-3 pl-4 pr-2 py-3 bg-[#222432] border border-[#1A1D2D] rounded-lg"
        href={`https://www.karmahq.xyz/profile/${address}#elementfinance`}
        target="_blank"
        rel="noreferrer"
      >
        <Image src="/karma-logo-dark.svg" alt="Karma" width={80} height={20} />
        <ChevronRightIcon fill="#626890" width={24} />
      </a> */}
    </div>
  );
}

interface VoterData {
  gscStatus: GSCStatus | null;
  proposalsCreated: number;
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
            proposalsCreated: proposalsCreatedByAddress.length,
          };
        }
      : undefined,
    refetchOnWindowFocus: false,
  });
}
