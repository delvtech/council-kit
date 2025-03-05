import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { useJoinGsc } from "src/ui/vaults/gscVault/hooks/useJoinGsc";
import { GscStatus } from "src/utils/vaults/gsc/types";

interface GscMembershipStatusStatProps {
  status: GscStatus;
  onJoin?: () => void;
}

export function GscMembershipStatusStat({
  status,
  onJoin,
}: GscMembershipStatusStatProps): ReactElement {
  const { joinGsc, status: joinGscStatus } = useJoinGsc();
  return (
    <Stat
      label="Your GSC Membership Status"
      value={
        <div className="flex items-center gap-2">
          {status}

          {onJoin && status === "Eligible" && (
            <button
              className="daisy-btn daisy-btn-outline daisy-btn-primary daisy-btn-xs mt-1"
              disabled={joinGscStatus === "pending"}
              onClick={joinGsc}
            >
              Join
            </button>
          )}
        </div>
      }
    />
  );
}
