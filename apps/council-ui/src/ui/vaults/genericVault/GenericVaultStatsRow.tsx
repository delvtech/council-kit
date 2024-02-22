import { ReactElement } from "react";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { YOUR_VOTING_POWER_TIP } from "src/ui/vaults/tooltips";

interface GeneircVaultStatsRowProps {
  accountVotingPower: bigint;
}

export function GenericVaultStatsRow({
  accountVotingPower,
}: GeneircVaultStatsRowProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat
        label={
          <DefinitionTooltip content={YOUR_VOTING_POWER_TIP}>
            Your voting power
          </DefinitionTooltip>
        }
        value={
          accountVotingPower ? formatVotingPower(accountVotingPower) : "None"
        }
      />
    </div>
  );
}
