import Link from "next/link";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { makeVoterURL } from "src/routes";
import { useDisplayName } from "src/ui/base/formatting/useDisplayName";
import { WalletIcon } from "src/ui/base/WalletIcon";

interface ProposalStatsBarProps {
  createdBy: string | null;
  createdAtDate: Date | null;
  endsAtDate: Date | null;
  unlockAtDate: Date | null;
  lastCallAtDate: Date | null;
}

export function ProposalStatsBar({
  createdBy,
  createdAtDate,
  endsAtDate,
  unlockAtDate,
  lastCallAtDate,
}: ProposalStatsBarProps): ReactElement {
  const createdByDisplayName = useDisplayName(createdBy);
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

      {createdByDisplayName && createdBy && (
        <div className="daisy-stats">
          <div className="daisy-stat bg-base-300">
            <div className="daisy-stat-title">Created By</div>
            <div className="text-sm daisy-stat-value">
              <Link
                className="hover:underline flex items-center"
                href={makeVoterURL(createdBy)}
              >
                <WalletIcon address={createdBy} size={16} className="mr-1" />
                {createdByDisplayName}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================ Skeletons ================

export function ProposalStatsBarSkeleton(): ReactElement {
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
      <div className="daisy-stats">
        <div className="daisy-stat bg-base-300">
          <div className="daisy-stat-title">Created By</div>
          <div className="text-sm daisy-stat-value">
            <Skeleton width={90} />
          </div>
        </div>
      </div>
    </div>
  );
}
