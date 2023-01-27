import { Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { useClaimGrant } from "src/ui/vaults/vestingVault/hooks/useGrantClaim";
import { useSigner } from "wagmi";

interface GrantCardProps {
  expirationDate: Date | null;
  grantBalance: string;
  grantBalanceWithdrawn: string;
  unlockDate: Date | null;
  vestingVaultAddress: string;
}

export function GrantCard({
  expirationDate,
  grantBalance,
  grantBalanceWithdrawn,
  unlockDate,
  vestingVaultAddress,
}: GrantCardProps): ReactElement {
  const currentDate = new Date();
  const { data: signer } = useSigner();
  const { mutate: claim } = useClaimGrant(vestingVaultAddress);

  const grantExist = !!signer && parseEther(grantBalance).gt(0);
  const canClaim =
    unlockDate &&
    unlockDate.getTime() < currentDate.getTime() &&
    !!grantBalance;

  if (!grantExist) {
    return (
      <div className="flex flex-col p-4 gap-y-4 daisy-card bg-base-300 h-fit">
        <div className="text-2xl font-bold">Your Vesting Info</div>

        <p>There is no grant allocated for this account.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-y-4 daisy-card bg-base-300 h-fit">
      <div className="text-2xl font-bold">Your Vesting Info</div>

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
        >
          Withdraw ELFI
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
            Withdraw ELFI
          </button>
        </div>
      )}
    </div>
  );
}

// ================ Skeletons ================

export function GrantCardSkeleton(): ReactElement {
  return (
    <div className="flex flex-col p-4 gap-y-4 daisy-card bg-base-300 h-fit">
      <div className="text-2xl font-bold">Your Vesting Info</div>

      <div className="flex flex-col gap-y-2">
        <div className="flex">
          <p>Grant Amount</p>
          <p className="w-32 ml-auto font-bold">
            <Skeleton />
          </p>
        </div>

        <div className="flex">
          <p>Grant Claimed</p>
          <p className="w-32 ml-auto font-bold">
            <Skeleton />
          </p>
        </div>

        <div className="flex">
          <p>Vesting Starts</p>
          <p className="w-32 ml-auto font-bold">
            <Skeleton />
          </p>
        </div>

        <div className="flex">
          <p>Vesting Ends</p>
          <p className="w-32 ml-auto font-bold">
            <Skeleton />
          </p>
        </div>
      </div>

      <div
        className="daisy-tooltip"
        data-tip="The vesting period has not started yet."
      >
        <button className="w-full daisy-btn daisy-btn-primary" disabled={true}>
          Withdraw ELFI
        </button>
      </div>
    </div>
  );
}
