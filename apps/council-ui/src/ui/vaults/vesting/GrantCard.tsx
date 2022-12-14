import { Signer } from "ethers";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useClaimGrant } from "src/ui/vaults/hooks/useGrantClaim";
import { useSigner } from "wagmi";

interface GrantCardProps {
  vestingVaultAddress: string;
  creationDate: Date;
  expirationDate: Date;
  grantBalance: string;
  grantBalanceWithdrawn: string;
  unlockDate: Date;
}

export function GrantCard({
  vestingVaultAddress,
  grantBalance,
  grantBalanceWithdrawn,
  creationDate,
  expirationDate,
  unlockDate,
}: GrantCardProps): ReactElement {
  const currentDate = new Date();

  const { data: signer } = useSigner();
  const { mutate: claim } = useClaimGrant(vestingVaultAddress);

  return (
    <div className="flex flex-col gap-y-4 daisy-card p-4 bg-base-300 h-fit">
      <div className="text-2xl font-bold">Your Grant</div>

      <div className="flex flex-col gap-y-2">
        <div className="flex">
          <p>Grant Amount</p>
          <p className="ml-auto font-bold">
            {formatBalance(grantBalance)} ELFI
          </p>
        </div>

        <div className="flex">
          <p>Grant Claimed</p>
          <p className="ml-auto font-bold">
            {formatBalance(grantBalanceWithdrawn)} ELFI
          </p>
        </div>

        <div className="flex">
          <p>Created Date</p>
          <p className="ml-auto font-bold">
            {creationDate.toLocaleDateString()}
          </p>
        </div>

        <div className="flex">
          <p>Vesting Starts</p>
          <p className="ml-auto font-bold">{unlockDate.toLocaleDateString()}</p>
        </div>

        <div className="flex">
          <p>Vesting Ends</p>
          <p className="ml-auto font-bold">
            {expirationDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      {unlockDate.getTime() > currentDate.getTime() ? (
        <div
          className="daisy-tooltip"
          data-tip="The vesting period has not started yet."
        >
          <button
            className="daisy-btn daisy-btn-primary w-full"
            disabled={true}
          >
            Withdraw
          </button>
        </div>
      ) : (
        <div className="daisy-tooltip" data-tip="hello">
          <button
            className="daisy-btn daisy-btn-primary w-full"
            onClick={() => claim({ signer: signer as Signer })}
            disabled={!signer}
          >
            Withdraw
          </button>
        </div>
      )}
    </div>
  );
}
