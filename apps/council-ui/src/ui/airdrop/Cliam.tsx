import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import Input from "./common/Input";
import Label from "./common/Label";
import { TrackCurrentAirDropStepI } from "./hooks/useAirdropSteps";

interface ClaimProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function Cliam({
  updateCurrentStepStatus,
}: ClaimProps): ReactElement {
  return (
    <div className="min-w-[400px] text-start space-y-1">
      <div className="daisy-form-control">
        <Label htmlFor="address">Address</Label>
        <Input className="daisy-input" type="text" name="address" id="address" />
        <label className="daisy-label daisy-label-text-alt">The tokens will be sent to this address.</label>
      </div>
      <div className="flex justify-center gap-2 pt-10">
        <button
          className="daisy-btn gap-2 px-8"
          onClick={() =>
            updateCurrentStepStatus(AIRDROP_STEPS.DEPOSIT_OR_CLAIM)
          }
        >
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn-primary daisy-btn gap-2"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.CONFIRM_CLIAM)}
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
