import {
  LockingVault,
  VestingVault,
  Vote,
  Voter,
  VotingContract,
  VotingVault,
  VotingVaultDataSource,
} from "@council/sdk";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { Address } from "src/ui/base/Address";
import { ErrorMessage } from "src/ui/base/error/ErrorMessage";
import { Page } from "src/ui/base/Page";
import { useCouncil } from "src/ui/council/useCouncil";
import { GSCStatus, useGSCStatus } from "src/ui/voters/hooks/useGSCStatus";
import {
  VoterStatsRow,
  VoterStatsRowSkeleton,
} from "src/ui/voters/VoterStatsRow";
import {
  VoterVaultsList,
  VoterVaultsListSkeleton,
} from "src/ui/voters/VoterVaultsList";
import {
  VotingHistoryTable,
  VotingHistoryTableSkeleton,
} from "src/ui/voters/VotingHistoryTable";
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

      <div>
        {status === "success" ? (
          <VoterStatsRow
            gscStatus={data.gscStatus}
            proposalsVoted={data.votingHistory.length}
            votingPower={data.votingPower}
          />
        ) : (
          <VoterStatsRowSkeleton />
        )}

        <div className="flex flex-col items-start w-full mt-8 gap-y-8">
          <div className="flex flex-col w-full gap-y-4">
            <h2 className="text-2xl font-bold">Voting History</h2>
            {status === "success" ? (
              <VotingHistoryTable history={data.votingHistory} />
            ) : (
              <VotingHistoryTableSkeleton />
            )}
          </div>

          {status === "success" ? (
            <div className="flex flex-col gap-y-4">
              <h2 className="text-2xl font-bold">
                Voting Vaults ({data.voterDataByVault.length})
              </h2>
              <VoterVaultsList vaultData={data.voterDataByVault} />
            </div>
          ) : (
            <div className="flex flex-col gap-y-4">
              <h2 className="w-64 text-2xl">
                <Skeleton />
              </h2>
              <VoterVaultsListSkeleton />
            </div>
          )}
        </div>
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
      <h1 className="w-full text-5xl">{ens}</h1>
      <a
        href={makeEtherscanAddressURL(address)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <h2 className="flex items-center w-full mt-2 text-2xl underline">
          <Address address={address} options={{ iconSize: 24 }} />
        </h2>
      </a>
    </div>
  ) : (
    <h1 className="w-full mt-2 text-5xl">
      <Address address={address} options={{ iconSize: 36 }} />
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

  return useQuery({
    queryKey: ["voter-stats", address, gscStatus],
    enabled: !!address,
    queryFn: async (): Promise<VoterData> => {
      const voter = new Voter(address as string, context);
      const votingHistory = await voter.getVotes(coreVoting.address);
      const votingPower = await voter.getVotingPower(
        coreVoting.vaults.map((vault) => vault.address),
      );
      const voterDataByVault = await getVoterDataByVault(
        address as string,
        coreVoting,
      );

      return {
        votingHistory: votingHistory,
        votingPower,
        gscStatus: gscStatus ?? null,
        voterDataByVault,
      };
    },
    refetchOnWindowFocus: false,
  });
}

interface VoterDataByVault {
  vault: VotingVault;
  votingPower: string;
  balance?: string;
  numDelegated?: number;
  currentDelegate?: Voter;
}

// TODO @ryan: can we have something like implemented in the sdk?
async function getVoterDataByVault(
  address: string,
  coreVoting: VotingContract<VotingVault<VotingVaultDataSource>[]>,
): Promise<VoterDataByVault[]> {
  return Promise.all(
    coreVoting.vaults.map(async (vault) => {
      const name = vault.name;
      const votingPower = await vault.getVotingPower(address);

      if (vault instanceof LockingVault) {
        const balance = await vault.getDepositedBalance(address);
        const numDelegated = (await vault.getDelegatorsTo(address)).length;
        const currentDelegate = await vault.getDelegate(address);
        return {
          vault,
          votingPower,
          balance,
          numDelegated,
          currentDelegate,
        };
      }

      if (vault instanceof VestingVault) {
        const balance = await (await vault.getGrant(address)).votingPower;
        const numDelegated = (await vault.getDelegatorsTo(address)).length;
        const currentDelegate = await vault.getDelegate(address);
        return {
          vault,
          votingPower,
          balance,
          numDelegated,
          currentDelegate,
        };
      }

      return {
        vault,
        name,
        votingPower,
      };
    }),
  );
}
