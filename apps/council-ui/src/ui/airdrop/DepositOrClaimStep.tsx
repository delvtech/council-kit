import { BuildingLibraryIcon, WalletIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import { formatBalance } from "src/ui/base/formatting/formatBalance";
import { AirdropIcon } from "src/ui/base/svg/24/AirdropIcon";
import { useTokenSymbol } from "src/ui/token/hooks/useTokenSymbol";
import { useAirdropToken } from "./hooks/useAirdropToken";
import { useClaimableAirdropAmount } from "./hooks/useClaimableAirdropAmount";

interface DepositOrClaimStepProps {
  onDeposit: (() => void) | undefined;
  onClaim: (() => void) | undefined;
}

export default function DepositOrClaimStep({
  onDeposit,
  onClaim,
}: DepositOrClaimStepProps): ReactElement {
  const { data: claimableAmount } = useClaimableAirdropAmount();
  const { data: token } = useAirdropToken();
  const { data: symbol } = useTokenSymbol(token?.address);

  return (
    <>
      <div>
        <p className="mb-2 text-lg">You&apos;ve been airdropped</p>
        <div className="daisy-stats bg-base-200">
          <div className="daisy-stat">
            <span className="daisy-stat-value flex items-center gap-3">
              <span className="text-accent flex">
                <AirdropIcon />
              </span>
              <span className="flex items-end">
                {claimableAmount && symbol ? (
                  formatBalance(claimableAmount, 4)
                ) : (
                  <Skeleton width={120} className="inline" />
                )}
                <span className="text-sm mx-1">{symbol}</span>
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
            className="daisy-btn gap-2 grow"
            disabled={!onClaim}
            onClick={onClaim}
          >
            <WalletIcon className="w-5 h-5 fill-current" />
            Claim
          </button>
          <button
            className="daisy-btn-primary daisy-btn gap-2 grow"
            disabled={!onDeposit}
            onClick={onDeposit}
          >
            <BuildingLibraryIcon className="w-5 h-5 fill-current" />
            Deposit
          </button>
        </div>
      </div>
    </>
  );
}
