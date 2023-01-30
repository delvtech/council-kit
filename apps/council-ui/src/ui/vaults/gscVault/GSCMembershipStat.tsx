import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { GSCStatus } from "src/vaults/gscVault/types";
import { useAccount } from "wagmi";

interface GSCMembershipStatProps {
  account: string | undefined;
  accountMembership: GSCStatus;
}

export function GSCMembershipStat({
  account,
  accountMembership,
}: GSCMembershipStatProps): ReactElement {
  const { address: connectedAccount } = useAccount();
  const showJoinButton =
    account === connectedAccount && accountMembership === "Eligible";

  return (
    <Stat
      label="Your GSC Membership Status"
      value={
        <div className="flex gap-4">
          {accountMembership}{" "}
          {showJoinButton ? (
            <button className="daisy-btn daisy-btn-xs daisy-btn-primary daisy-btn-outline">
              Join
            </button>
          ) : null}
        </div>
      }
    />
  );
}
