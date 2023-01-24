import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { GSCStatus } from "src/vaults/gscVault";

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
      <Stat label="Total Voting Power" value={formatBalance(votingPower, 0)} />

      {gscStatus && <Stat label="GSC Member" value={gscStatus} />}

      <Stat label="Proposals voted" value={proposalsVoted} />
    </div>
  );
}

export function VoterStatsRowSkeleton(): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Total Voting Power" value={<Skeleton />} />
      <Stat label="GSC Member" value={<Skeleton />} />
      <Stat label="Proposals voted" value={<Skeleton />} />
    </div>
  );
}
