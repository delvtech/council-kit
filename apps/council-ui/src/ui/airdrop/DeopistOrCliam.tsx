import { BuildingLibraryIcon, WalletIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import AirdropIcon from "./AirdropIcon";
import { TrackCurrentAirDropStepI } from "./hooks/useAirdropSteps";

interface DepositOrClaimProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function DepositOrClaim({
  updateCurrentStepStatus,
}: DepositOrClaimProps): ReactElement {
  return (
    <>
      <div className="p-10 mx-auto">
        <p className="mb-2">You&apos;ve been airdropped</p>
        <div className="daisy-stats bg-base-200">
          <div className="daisy-stat">
            <span className="daisy-stat-value flex items-center gap-3">
              <AirdropIcon className="h-5 w-5" fillClass="fill-black" />
              <span>
                2,000.0<span className="text-sm mx-1">MVT</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-lg text-sm">
        These tokens can be <b>deposited</b> into the locking vault for
        immediate voting power or <b>claimed</b> directly to a wallet.
      </p>
      <div className="flex justify-center gap-2">
        <button
          className="daisy-btn-primary daisy-btn gap-2"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.DEPOSIT)}
        >
          <BuildingLibraryIcon className="w-5 h-5 fill-white" />
          Deposit
        </button>
        <button
          className="daisy-btn gap-2"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.CLAIM)}
        >
          <WalletIcon className="w-5 h-5 fill-white" />
          Claim
        </button>
      </div>
    </>
  );
}
