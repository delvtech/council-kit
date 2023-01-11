import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { GSCStatus } from "src/ui/voters/hooks/useGSCStatus";

interface VoterStatsRowProps {
  gscStatus: GSCStatus | null;
  proposalsVoted: number;
  votingPower: string;
}

export function VoterStatsRow({
  gscStatus,
  votingPower,
  proposalsVoted,
}: VoterStatsRowProps): ReactElement {
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

export function VoterStatsRowSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Power</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">GSC Member</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Proposals voted</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
