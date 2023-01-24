import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { Stat } from "src/ui/base/Stat";
import { GSCStatus } from "src/vaults/gscVault";

interface GSCVaultStatsBarProps {
  activeProposalCount: number;
  accountMembership: GSCStatus;
  membersCount: number;
  requiredVotingPower: string;
}

export function GSCVaultStatsBar({
  activeProposalCount,
  accountMembership,
  membersCount,
  requiredVotingPower,
}: GSCVaultStatsBarProps): ReactElement {
  return (
    <div className="flex flex-wrap gap-4">
      {activeProposalCount >= 0 && (
        <Stat label="Active GSC Proposals" value={activeProposalCount} />
      )}

      {accountMembership && (
        <Stat label="Your GSC Membership Status" value={accountMembership} />
      )}

      {membersCount >= 0 && (
        <Stat label="# of GSC Members" value={membersCount} />
      )}
      <Stat
        label="VP Threshold to be on the GSC"
        value={formatBalance(requiredVotingPower)}
      />
    </div>
  );
}
