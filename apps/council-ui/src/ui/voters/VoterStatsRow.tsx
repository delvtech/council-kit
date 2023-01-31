import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { GSCStatus } from "src/vaults/gscVault/types";

interface VoterStatsRowProps {
  gscStatus: GSCStatus | null;
  proposalsCreated: number;
  proposalsVoted: number;
  votingPower: string;
}

export function VoterStatsRow({
  gscStatus,
  proposalsCreated,
  proposalsVoted,
  votingPower,
}: VoterStatsRowProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Total Voting Power" value={formatBalance(votingPower, 0)} />
      <Stat label="Proposals voted" value={proposalsVoted} />
      <Stat label="Proposals created" value={proposalsCreated} />
      {gscStatus && <Stat label="GSC Member" value={gscStatus} />}
    </div>
  );
}
