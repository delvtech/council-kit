import { getAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { makeEtherscanAddressURL } from "src/lib/etherscan/makeEtherscanAddressURL";
import { formatAddress } from "src/ui/base/formatting/formatAddress";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Page } from "src/ui/base/Page";
import { Progress } from "src/ui/base/Progress";
import { ExternalLinkSVG } from "src/ui/base/svg/ExternalLink";
import { GSCStatus } from "src/ui/voter/hooks/useGSCStatus";
import { useVoterDataByVault } from "src/ui/voter/hooks/useVoterDataByVault";
import { useVoterStats } from "src/ui/voter/hooks/useVoterStats";
import { VoterVaultsList } from "src/ui/voter/VoterVaultsList";
import { VotingHistoryTable } from "src/ui/voter/VotingHistoryTable";
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
          <div className="items-center text-center daisy-card-body">
            <h2 className="daisy-card-title">Error!</h2>
            <p>No address provided or address is malformed.</p>
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
              <h2 className="w-full mt-2 text-2xl underline">
                {formatAddress(address)}
                <ExternalLinkSVG size={24} />
              </h2>
            </a>
          </div>
        ) : (
          <h1 className="w-full mt-2 text-5xl underline">
            <a
              href={makeEtherscanAddressURL(address)}
              rel="noopener noreferrer"
              target="_blank"
            >
              {formatAddress(address)}
              <ExternalLinkSVG size={24} />
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

        <div className="flex flex-col items-start w-full mt-8 gap-y-8">
          <div className="flex flex-col w-full gap-y-4">
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
          <div className="text-sm daisy-stat-value">
            {formatBalance(votingPower, 0)}
          </div>
        </div>
      </div>

      {gscStatus && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">GSC Member</div>
            <div className="text-sm daisy-stat-value">{gscStatus}</div>
          </div>
        </div>
      )}

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Proposals voted</div>
          <div className="text-sm daisy-stat-value">{proposalsVoted}</div>
        </div>
      </div>
    </div>
  );
}
