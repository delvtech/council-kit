import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { GSCStatus } from "src/ui/utils/formatGSCStatus";
import { VoterVaultsList } from "src/ui/voter/components/VoterVaultsList";
import { VotingHistoryTable } from "src/ui/voter/components/VotingHistoryTable";
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
  const { data: ens, isLoading: ensLoading } = useEnsName({
    address: getAddress(address as string),
    enabled: !!address,
  });

  if (!address) {
    return (
      <div className="flex flex-col items-center gap-8 mt-48">
        <div className="daisy-card bg-neutral text-neutral-content">
          <div className="daisy-card-body items-center text-center">
            <h2 className="daisy-card-title">Error!</h2>
            <p>No address provided or is malformed.</p>
          </div>
        </div>
      </div>
    );
  }

  if (voterStatsLoading && vaultsDataLoading && ensLoading) {
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
          <div>
            <h1 className="w-full text-5xl">{ens}</h1>
            <a
              href={makeEtherscanAddressURL(address)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <h2 className="mt-2 w-full text-2xl underline">
                {formatAddress(address)}
                <ExternalLinkSVG size={24} />
              </h2>
            </a>
          </div>
        ) : (
          <h1 className="mt-2 w-full text-5xl">
            <a
              href={makeEtherscanAddressURL(address)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <h2 className="mt-2 w-full text-5xl underline">
                {formatAddress(address)}
                <ExternalLinkSVG size={24} />
              </h2>
            </a>
          </h1>
        )}
      </div>

      <div>
        {voterStats && (
          <VoterStatisticsRow
            gscStatus={voterStats.gscStatus}
            votingPower={voterStats.votingPower}
            proposalsVoted={voterStats.votingHistory.length}
          />
        )}

        <div className="flex w-full flex-col items-start gap-y-8 mt-8">
          <div className="flex flex-col gap-y-4 w-full">
            <h2 className="text-2xl font-bold">Voting History</h2>
            <VotingHistoryTable
              history={voterStats ? voterStats.votingHistory : []}
            />
          </div>

          {voterDataByVault && (
            <div className="flex flex-col gap-y-4">
              <h2 className="text-2xl font-bold">
                Voting Vaults ({voterDataByVault.length})
              </h2>
              <VoterVaultsList vaultData={voterDataByVault} />
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

interface VoterStatisticsRowProps {
  gscStatus: GSCStatus | null;
  proposalsVoted: number;
  votingPower: string;
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

      {gscStatus && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">GSC Member</div>
            <div className="daisy-stat-value text-sm">{gscStatus}</div>
          </div>
        </div>
      )}

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Proposals voted</div>
          <div className="daisy-stat-value text-sm">{proposalsVoted}</div>
        </div>
      </div>
    </div>
  );
}
