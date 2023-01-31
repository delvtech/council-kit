import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { GSCStatus } from "src/vaults/gscVault/types";

interface GSCMembershipStatusStatProps {
  accountMembership: GSCStatus;
}
export function GSCMembershipStatusStat({
  accountMembership,
}: GSCMembershipStatusStatProps): ReactElement {
  return <Stat label="Your GSC Membership Status" value={accountMembership} />;
}
