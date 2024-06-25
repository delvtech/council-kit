import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip";
import { formatVotingPower } from "src/ui/base/formatting/formatVotingPower";
import { GscStatus } from "src/utils/gscVault/types";
import { GscMembershipStatusStat } from "./GscMembershipStatusStat";

interface GSCVaultStatsRowProps {
  accountMembership: GscStatus;
  membersCount: number;
  requiredVotingPower: bigint;
  onJoin?: () => void;
}

export function GSCVaultsStatsRow({
  accountMembership,
  membersCount,
  requiredVotingPower,
  onJoin,
}: GSCVaultStatsRowProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      {accountMembership && (
        <GscMembershipStatusStat status={accountMembership} onJoin={onJoin} />
      )}

      {membersCount >= 0 && (
        <Stat label="# of GSC Members" value={membersCount} />
      )}

      <Stat
        label={
          <DefinitionTooltip
            content={
              "The amount of voting power an account must have to able to to join the GSC. "
            }
          >
            Voting Power Required to be a GSC Member
          </DefinitionTooltip>
        }
        value={formatVotingPower(requiredVotingPower)}
      />
    </div>
  );
}
