import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import Button from "./common/Button";
import Input from "./common/Input";
import Label from "./common/Label";
import { TrackCurrentAirDropStepI } from "./hooks/useTrackAirdropSteps";

interface ClaimProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function Cliam({
  updateCurrentStepStatus,
}: ClaimProps): ReactElement {
  return (
    <div className="min-w-[400px] text-start space-y-1">
      <Label htmlFor="address">Address</Label>
      <Input type="text" name="address" id="address" />
      <p className="text-xs">The tokens will be sent to this address.</p>
      <div className="flex justify-center gap-2 pt-10">
        <Button
          color="secondary"
          onClick={() =>
            updateCurrentStepStatus(AIRDROP_STEPS.DEPOSIT_OR_CLAIM)
          }
        >
          <ArrowLeftIcon className="w-4 h-4 fill-black" />
          Back
        </Button>
        <Button
          color="primary"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.CONFIRM_CLIAM)}
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-white" />
        </Button>
      </div>
    </div>
  );
}
