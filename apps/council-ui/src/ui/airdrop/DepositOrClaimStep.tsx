import { BuildingLibraryIcon, WalletIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { useAirdropToken } from "src/ui/airdrop/hooks/useAirdropToken";
import { useClaimableAirdropAmount } from "src/ui/airdrop/hooks/useClaimableAirdropAmount";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { AirdropIcon } from "src/ui/base/svg/24/AirdropIcon";
import { useTokenSymbol } from "src/ui/token/hooks/useTokenSymbol";

interface DepositOrClaimStepProps {
  onDeposit: (() => void) | undefined;
  onClaim: (() => void) | undefined;
}

export default function DepositOrClaimStep({
  onDeposit,
  onClaim,
}: DepositOrClaimStepProps): ReactElement {
  const { claimableAmountFormatted } = useClaimableAirdropAmount();
  const { airdropToken } = useAirdropToken();
  const { symbol } = useTokenSymbol(airdropToken);

  return (
    <>
      <div>
        <p className="mb-2 text-lg">You&apos;ve been airdropped</p>
        <div className="daisy-stats bg-base-200">
          <div className="daisy-stat">
            <span className="daisy-stat-value flex items-center gap-3">
              <span className="flex text-accent">
                <AirdropIcon />
              </span>
              <span className="flex items-end">
                {claimableAmountFormatted && symbol ? (
                  formatBalance(claimableAmountFormatted, 4)
                ) : (
                  <Skeleton width={120} className="inline" />
                )}
                <span className="mx-1 text-sm">{symbol}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <p className="mb-4">
          These tokens can be <strong>claimed</strong> to a wallet or{" "}
          <strong>deposited</strong> directly into the locking vault for
          immediate voting power.
        </p>
        <div className="flex justify-center gap-2 sm:gap-4">
          <button
            className="daisy-btn grow gap-2"
            disabled={!onClaim}
            onClick={onClaim}
          >
            <WalletIcon className="size-5 fill-current" />
            Claim
          </button>
          <button
            className="daisy-btn daisy-btn-primary grow gap-2"
            disabled={!onDeposit}
            onClick={onDeposit}
          >
            <BuildingLibraryIcon className="size-5 fill-current" />
            Deposit
          </button>
        </div>
      </div>
    </>
  );
}
