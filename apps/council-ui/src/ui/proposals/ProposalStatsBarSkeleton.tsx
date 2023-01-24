import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Stat } from "src/ui/base/Stat";

export function ProposalStatsBarSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Voting contract" value={<Skeleton width={90} />} />
      <Stat label="Created by" value={<Skeleton width={90} />} />
      <Stat label="Created at" value={<Skeleton width={90} />} />
      <Stat label="Executable on" value={<Skeleton width={90} />} />
      <Stat label="Voting ends" value={<Skeleton width={90} />} />
      <Stat label="Execution deadline" value={<Skeleton width={90} />} />
    </div>
  );
}
