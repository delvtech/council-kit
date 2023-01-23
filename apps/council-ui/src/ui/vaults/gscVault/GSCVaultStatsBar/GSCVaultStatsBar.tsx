import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { GSCStatus } from "src/vaults/gscVault";

interface GSCVaultStatsBarProps {
  activeProposalCount: number;
  accountMembership: GSCStatus;
  membersCount: number;
}

export function GSCVaultStatsBar({
  activeProposalCount,
  accountMembership,
  membersCount,
}: GSCVaultStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      {activeProposalCount >= 0 && (
        <Stat label="Active Proposals" value={activeProposalCount} />
      )}

      {accountMembership && (
        <Stat label="Your GSC Membership Status" value={accountMembership} />
      )}

      {membersCount >= 0 && (
        <Stat label="# of GSC Members" value={membersCount} />
      )}
    </div>
  );
}
