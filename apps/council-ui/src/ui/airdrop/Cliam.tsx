import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import { TrackCurrentAirDropStepI } from "./hooks/useAirdropSteps";

interface ClaimProps extends Partial<TrackCurrentAirDropStepI> {
  setCurrentStepStatus: TrackCurrentAirDropStepI["setCurrentStepStatus"];
}

export default function Cliam({
  setCurrentStepStatus,
}: ClaimProps): ReactElement {
  return (
    <div className="min-w-[400px] text-start space-y-1">
      <label className="daisy-label text-lg font-bold" htmlFor="address">
        Address
      </label>
      <input
        className="w-full daisy-input-bordered daisy-input"
        type="text"
        name="address"
        id="address"
      />
      <p className="text-xs my-2">The tokens will be sent to this address.</p>
      <div className="flex justify-center gap-2 pt-10">
        <button
          className="daisy-btn gap-2 px-8"
          onClick={() => setCurrentStepStatus(AIRDROP_STEPS.DEPOSIT_OR_CLAIM)}
        >
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn-primary daisy-btn gap-2"
          onClick={() => setCurrentStepStatus(AIRDROP_STEPS.CONFIRM_CLIAM)}
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
