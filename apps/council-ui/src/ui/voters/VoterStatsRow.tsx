import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { GSCStatus } from "src/vaults/gscVault/types";

interface VoterStatsRowProps {
  gscStatus: GSCStatus | null;
  proposalsCreated: number;
  proposalsVoted: number;
  votingPower: string;
  percentOfTVP: number;
}

export function VoterStatsRow({
  gscStatus,
  proposalsCreated,
  proposalsVoted,
  votingPower,
  percentOfTVP,
}: VoterStatsRowProps): ReactElement {
  let percentOfTVPLabel = percentOfTVP > 0.1 ? `${percentOfTVP}%` : "< 0.1%";
  if (!percentOfTVP) {
    percentOfTVPLabel = "0";
  }
  return (
    <div className="flex flex-wrap gap-4">
      <Stat label="Voting Power" value={formatBalance(votingPower, 0)} />
      <Stat
        label={
          <span>
            % of{" "}
            <DefinitionTooltip content="Total voting power from all voters.">
              TVP
            </DefinitionTooltip>
          </span>
        }
        value={percentOfTVPLabel}
      />
      <Stat label="Proposals voted" value={proposalsVoted} />
      <Stat label="Proposals created" value={proposalsCreated} />
      {gscStatus && <Stat label="GSC Member" value={gscStatus} />}
    </div>
  );
}
