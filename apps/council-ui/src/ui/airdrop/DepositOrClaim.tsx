import { BuildingLibraryIcon, WalletIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";
import { AirdropIcon } from "src/ui/base/svg/24/AirdropIcon";

interface DepositOrClaimProps {
  onDeposit: () => void;
  onClaim: () => void;
}

export default function DepositOrClaim({
  onDeposit,
  onClaim,
}: DepositOrClaimProps): ReactElement {
  return (
    <>
      <div className="p-10 mx-auto">
        <p className="mb-2 text-lg">You&apos;ve been airdropped</p>
        <div className="daisy-stats bg-base-200">
          <div className="daisy-stat">
            <span className="daisy-stat-value flex items-center gap-3">
              <AirdropIcon />
              <span>
                2,000.0<span className="text-sm mx-1">MVT</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-lg">
        These tokens can be <strong>deposited</strong> into the locking vault
        for immediate voting power or <strong>claimed</strong> directly to a
        wallet.
      </p>
      <div className="flex justify-center gap-2">
        <button
          className="daisy-btn-primary daisy-btn gap-2"
          onClick={onDeposit}
        >
          <BuildingLibraryIcon className="w-5 h-5 fill-current" />
          Deposit
        </button>
        <button className="daisy-btn gap-2" onClick={onClaim}>
          <WalletIcon className="w-5 h-5 fill-current" />
          Claim
        </button>
      </div>
    </>
  );
}
