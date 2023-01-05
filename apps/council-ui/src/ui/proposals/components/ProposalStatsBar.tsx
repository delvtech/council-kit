import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";

interface ProposalStatsBarProps {
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockAtDate: Date | null;
  lastCallAtDate: Date | null;
  isLoading?: boolean;
}

export function ProposalStatsBar({
  createdAtDate,
  endsAtDate,
  unlockAtDate,
  lastCallAtDate,
  isLoading,
}: ProposalStatsBarProps): ReactElement {
  if (isLoading) {
    return <ProposalStatsBarSkeleton />;
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Contract</div>
          <div className="text-sm daisy-stat-value">Core Voting</div>
        </div>
      </div>

      {createdAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Created</div>
            <div className="text-sm daisy-stat-value">
              {createdAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {endsAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Voting Ends</div>
            <div className="text-sm daisy-stat-value">
              {endsAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {unlockAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Unlocked</div>
            <div className="text-sm daisy-stat-value">
              {unlockAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {lastCallAtDate && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Last Call</div>
            <div className="text-sm daisy-stat-value">
              {lastCallAtDate.toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalStatsBarSkeleton() {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Contract</div>
          <div className="text-sm daisy-stat-value">Core Voting</div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Created</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Voting Ends</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Unlocked</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>

      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Last Call</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>
    </div>
  );
}
