import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Stat } from "src/ui/base/Stat";

export function ProposalStatsRowSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Voting contract" value={<Skeleton />} />
      <Stat label="Put on chain by" value={<Skeleton />} />
      <Stat label="Created transaction" value={<Skeleton />} />
      <Stat label="Voting ends" value={<Skeleton />} />
      <Stat label="Executable on" value={<Skeleton />} />
      <Stat label="Execution deadline" value={<Skeleton />} />
    </div>
  );
}
