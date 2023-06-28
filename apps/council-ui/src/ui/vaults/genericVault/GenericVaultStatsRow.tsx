import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import {
  PARTICIPANTS_TIP,
  YOUR_VOTING_POWER_TIP,
} from "src/ui/vaults/tooltips";

interface GeneircVaultStatsRowProps {
  accountVotingPower: string;
  participants?: number;
}

export function GenericVaultStatsRow({
  accountVotingPower,
  participants,
}: GeneircVaultStatsRowProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      <Stat
        label={
          <DefinitionTooltip content={YOUR_VOTING_POWER_TIP}>
            Your voting power
          </DefinitionTooltip>
        }
        value={+accountVotingPower ? formatBalance(accountVotingPower) : "None"}
      />

      {typeof participants !== "undefined" && (
        <Stat
          label={
            <DefinitionTooltip content={PARTICIPANTS_TIP}>
              Participants
            </DefinitionTooltip>
          }
          value={participants}
        />
      )}
    </div>
  );
}
