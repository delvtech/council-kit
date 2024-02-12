import { ReactElement } from "react";
import { Stat } from "src/ui/base/Stat";
import { GscStatus } from "src/utils/gscVault/types";

interface GscMembershipStatusStatProps {
  status: GscStatus;
  onJoin?: () => void;
}

export function GscMembershipStatusStat({
  status,
  onJoin,
}: GscMembershipStatusStatProps): ReactElement {
  return (
    <Stat
      label="Your GSC Membership Status"
      value={
        <div className="flex items-center gap-2">
          {status}

          {onJoin && (
            <button
              className="daisy-btn daisy-btn-outline daisy-btn-primary daisy-btn-xs mt-1"
              onClick={onJoin}
            >
              Join
            </button>
          )}
        </div>
      }
    />
  );
}
