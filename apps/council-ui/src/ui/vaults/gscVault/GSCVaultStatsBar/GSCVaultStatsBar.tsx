import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { GSCStatus } from "src/vaults/gscVault";

interface GSCVaultStatsBarProps {
  accountMembership: GSCStatus;
  membersCount: number;
  requiredVotingPower: string;
}

export function GSCVaultStatsBar({
  accountMembership,
  membersCount,
  requiredVotingPower,
}: GSCVaultStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      {accountMembership && (
        <Stat label="Your GSC Membership Status" value={accountMembership} />
      )}

      {membersCount >= 0 && (
        <Stat
          label={
            <>
              <DefinitionTooltip
                content={
                  "The total amount of accounts that have accepted and currently reside on the GSC."
                }
              >
                # of GSC Members
              </DefinitionTooltip>
            </>
          }
          value={membersCount}
        />
      )}

      <Stat
        label={
          <>
            <DefinitionTooltip
              content={
                "The amount of voting power an account must have delegated by others or self delegated to able to to join the GSC. "
              }
            >
              VP Threshold to be on the GSC
            </DefinitionTooltip>
          </>
        }
        value={formatBalance(requiredVotingPower)}
      />
    </div>
  );
}
