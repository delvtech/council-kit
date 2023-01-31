import { ReactElement, ReactNode } from "react";
import { Stat } from "src/ui/base/Stat";
import { useJoinGSC } from "src/ui/vaults/gscVault/useJoinGSC";
import { GSCStatus } from "src/vaults/gscVault/types";
import { useSigner } from "wagmi";

interface GSCMembershipStatusStatProps {
  gscVaultAddress: string;
  accountMembership: GSCStatus;
}
export function GSCMembershipStatusStat({
  gscVaultAddress,
  accountMembership,
}: GSCMembershipStatusStatProps): ReactElement {
  const { mutate: joinGSC } = useJoinGSC(gscVaultAddress);
  const { data: signer } = useSigner();
  let joinButton: ReactNode | null = null;

  if (accountMembership === "Eligible" && signer) {
    joinButton = (
      <button
        className="daisy-btn daisy-btn-xs daisy-btn-outline daisy-btn-primary mt-1"
        onClick={() => joinGSC({ signer })}
      >
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
