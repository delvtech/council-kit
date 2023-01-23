import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Stat } from "src/ui/base/Stat";

// ================ Skeletons ================

export function GSCVaultStatsBarSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Active Proposals" value={<Skeleton width={90} />} />
      <Stat
        label="Your GSC Membership Status"
        value={<Skeleton width={90} />}
      />
      <Stat label="# of GSC Members" value={<Skeleton width={90} />} />
    </div>
  );
}
