import { Signer } from "ethers";
import { ReactElement } from "react";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useClaimGrant } from "src/ui/vaults/hooks/useGrantClaim";
import { useSigner } from "wagmi";

interface GrantCardProps {
  expirationDate: Date | null;
  grantBalance: string;
  grantBalanceWithdrawn: string;
  grantWithdrawableAmount: string;
  unlockDate: Date | null;
  vestingVaultAddress: string;
}

export function GrantCard({
  expirationDate,
  grantBalance,
  grantBalanceWithdrawn,
  grantWithdrawableAmount,
  unlockDate,
  vestingVaultAddress,
}: GrantCardProps): ReactElement {
  const currentDate = new Date();
  const { data: signer } = useSigner();
  const { mutate: claim } = useClaimGrant(vestingVaultAddress);

  const canClaim =
    unlockDate &&
    unlockDate.getTime() < currentDate.getTime() &&
    !!grantBalance;

  return (
    <div className="flex flex-col p-4 gap-y-4 daisy-card bg-base-300 h-fit">
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

        {unlockDate && (
          <div className="flex">
            <p>Vesting Starts</p>
            <p className="ml-auto font-bold">
              {unlockDate.toLocaleDateString()}
            </p>
          </div>
        )}

        {expirationDate && (
          <div className="flex">
            <p>Vesting Ends</p>
            <p className="ml-auto font-bold">
              {expirationDate.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {canClaim ? (
        <button
          className="w-full daisy-btn daisy-btn-primary"
          onClick={() => claim({ signer: signer as Signer })}
          disabled={!signer}
        >
          Withdraw
        </button>
      ) : (
        <div
          className="daisy-tooltip"
          data-tip="The vesting period has not started yet."
        >
          <button
            className="w-full daisy-btn daisy-btn-primary"
            disabled={true}
          >
            {`Withdraw ${grantWithdrawableAmount} ELFI`}
          </button>
        </div>
      )}
    </div>
  );
}
