import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Stat } from "src/ui/base/Stat";

export function GSCVaultStatsBarSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Active GSC Proposals" value={<Skeleton width={90} />} />
      <Stat
        label="Your GSC Membership Status"
        value={<Skeleton width={90} />}
      />
      <Stat label="# of GSC Members" value={<Skeleton width={90} />} />
      <Stat
        label="VP Threshold to be on the GSC"
        value={<Skeleton width={90} />}
      />
    </div>
  );
}
