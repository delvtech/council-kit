import { BuildingLibraryIcon, WalletIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import AirdropIcon from "./AirdropIcon";
import Button from "./common/Button";
import { TrackCurrentAirDropStepI } from "./hooks/useTrackAirdropSteps";

interface DepositOrClaimProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function DepositOrClaim({
  updateCurrentStepStatus,
}: DepositOrClaimProps): ReactElement {
  return (
    <>
      <div className="p-10 mx-auto">
        <h5 className="text-md m-3">You&apos;ve been airdropped</h5>
        <span className="flex justify-center p-5 rounded-lg bg-zinc-200 w-52 items-center gap-3">
          <AirdropIcon className="h-5 w-5" fillClass="fill-black" />
          <span className="text-2xl font-bold">
            2,000.0<span className="text-sm mx-1">MVT</span>
          </span>
        </span>
      </div>
      <p className="mx-auto max-w-lg text-sm">
        These tokens can be <b>deposited</b> into the locking vault for
        immediate voting power or <b>claimed</b> directly to a wallet.
      </p>
      <div className="flex justify-center gap-2">
        <Button
          color="primary"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.DEPOSIT)}
        >
          <BuildingLibraryIcon className="w-5 h-5 fill-white" />
          Deposit
        </Button>
        <Button
          color="secondary"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.CLAIM)}
        >
          <WalletIcon className="w-5 h-5 fill-black" />
          Claim
        </Button>
      </div>
    </>
  );
}
