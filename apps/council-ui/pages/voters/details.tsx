import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { GSCStatus } from "src/ui/utils/formatGSCStatus";
import { VotingHistoryList } from "src/ui/voter/components/VotingHistoryList";
import { VotingPowerByVaultList } from "src/ui/voter/components/VotingPowerByVaultList";
import { useVoterDataByVault } from "src/ui/voter/hooks/useVoterDataByVault";
import { useVoterStats } from "src/ui/voter/hooks/useVoterStats";
import { useEnsName } from "wagmi";

export default function VoterDetailsPage(): ReactElement {
  const { query } = useRouter();
  const { address } = query as { address: string | undefined };

  const { data: voterStats, isLoading: voterStatsLoading } =
    useVoterStats(address);
  const { data: voterDataByVault, isLoading: vaultsDataLoading } =
    useVoterDataByVault(address);
  const { data: ens } = useEnsName({
    address: getAddress(address as string),
    enabled: !!address,
  });

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-8 mt-48">
        <div className="daisy-card bg-neutral text-neutral-content">
          <div className="daisy-card-body items-center text-center">
            <h2 className="daisy-card-title">Error!</h2>
            <p>No address provided or malformed.</p>
          </div>
        </div>
      </div>
    );
  }

  if (voterStatsLoading && vaultsDataLoading) {
    return (
      <div className="flex flex-col items-center gap-8 mt-48">
        <p>Loading voter details. This might take a while...</p>
        <Progress />
      </div>
    );
  }

  return (
    <Page>
      <div>
        {ens ? (
          <>
            <h1 className="w-full text-5xl text-accent-content">{ens}</h1>

            <h2 className="mt-2 w-full text-2xl underline">
              {formatAddress(address)}
            </h2>
          </>
        ) : (
          <h1 className="mt-2 w-full text-5xl text-accent-content underline">
            {formatAddress(address)}
          </h1>
        )}
      </div>

      <>
        {voterStats && voterStats.gscStatus && (
          <VoterStatisticsRow
            gscStatus={voterStats.gscStatus}
            votingPower={voterStats.votingPower}
            proposalsVoted={voterStats.votingHistory.length}
          />
        )}

        <div className="flex w-full flex-col gap-y-8 md:flex-row md:gap-x-4 md:gap-y-0">
          <div className="flex min-w-[500px] flex-col gap-y-4 sm:basis-[65%]">
            <h2 className="text-2xl font-bold">Voting History</h2>
            <VotingHistoryList
              history={voterStats ? voterStats.votingHistory : []}
            />
          </div>

          {voterDataByVault && (
            <div className="flex flex-col gap-y-4 sm:basis-[35%]">
              <div className="text-2xl font-bold">
                Voting Vault ({voterDataByVault.length})
              </div>
              <VotingPowerByVaultList vaultData={voterDataByVault} />
            </div>
          )}
        </div>
      </>
    </Page>
  );
}

interface VoterStatisticsRowProps {
  gscStatus: GSCStatus;
  votingPower: string;
  proposalsVoted: number;
}

function VoterStatisticsRow({
  gscStatus,
  votingPower,
  proposalsVoted,
}: VoterStatisticsRowProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Power</div>
          <div className="daisy-stat-value text-sm">
            {formatBalance(votingPower, 0)}
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">GSC Member</div>
          <div className="daisy-stat-value text-sm">{gscStatus}</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Proposals voted</div>
          <div className="daisy-stat-value text-sm">{proposalsVoted}</div>
        </div>
      </div>
    </div>
  );
}
