import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { DefinitionTooltip } from "src/ui/base/Tooltip/Tooltip";
import { GSCStatus } from "src/vaults/gscVault/types";
import { GSCMembershipStatusStat } from "./GSCMembershipStatusStat";

interface GSCVaultStatsRowProps {
  gscVaultAddress: string;
  accountMembership: GSCStatus;
  membersCount: number;
  requiredVotingPower: string;
}

export function GSCVaultsStatsRow({
  gscVaultAddress,
  accountMembership,
  membersCount,
  requiredVotingPower,
}: GSCVaultStatsRowProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      {accountMembership && (
        <GSCMembershipStatusStat
          gscVaultAddress={gscVaultAddress}
          accountMembership={accountMembership}
        />
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
        value={formatBalance(requiredVotingPower)}
      />
    </div>
  );
}
