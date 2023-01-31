import { ReactElement, ReactNode } from "react";
import { Stat } from "src/ui/base/Stat";
import { GSCStatus } from "src/vaults/gscVault/types";

interface GSCMembershipStatusStatProps {
  accountMembership: GSCStatus;
}
export function GSCMembershipStatusStat({
  accountMembership,
}: GSCMembershipStatusStatProps): ReactElement {
  let joinButton: ReactNode | null = null;
  if (accountMembership === "Eligible") {
    joinButton = (
      <button className="daisy-btn daisy-btn-xs daisy-btn-outline daisy-btn-primary mt-1">
        Join
      </button>
    );
  }
  return (
    <Stat
      label="Your GSC Membership Status"
      value={
        <div className="flex gap-2 items-center">
          {accountMembership}
          {joinButton}
        </div>
      }
    />
  );
}
