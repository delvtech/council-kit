import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { Stat } from "src/ui/base/Stat";

export function VoterStatsRowSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Voting Power" value={<Skeleton />} />
      <Stat label="% of TVP" value={<Skeleton />} />
      <Stat label="Proposals voted" value={<Skeleton />} />
      <Stat label="Proposals created" value={<Skeleton />} />
      <Stat label="GSC Member" value={<Skeleton />} />
    </div>
  );
}
