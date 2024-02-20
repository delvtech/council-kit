import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { formatUnitsBalance } from "src/ui/base/formatting/formatUnitsBalance";
import { GscStatus } from "src/utils/gscVault/types";

interface VoterStatsRowProps {
  gscStatus: GscStatus | undefined;
  proposalsCreated: number;
  proposalsVoted: number;
  votingPower: bigint;
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
      <Stat
        label="Voting Power"
        value={formatUnitsBalance({ balance: votingPower, displayDecimals: 0 })}
      />
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
