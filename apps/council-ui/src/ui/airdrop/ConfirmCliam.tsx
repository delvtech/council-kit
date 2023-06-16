import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import { TrackCurrentAirDropStepI } from "./hooks/useAirdropSteps";

interface ConfirmCliamProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function ConfirmCliam({
  updateCurrentStepStatus,
}: ConfirmCliamProps): ReactElement {
  function handleConfirm() {
    alert("handle confirm");
  }
  return (
    <div>
      <h1>confirm cliam</h1>
      <div className="flex justify-center gap-2 pt-10">
        <button
          className="daisy-btn gap-2 px-8"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.CLAIM)}
        >
          <ArrowLeftIcon className="w-4 h-4 fill-white" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2"
          onClick={handleConfirm}
        >
          Confirm
          <CheckIcon className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
}
