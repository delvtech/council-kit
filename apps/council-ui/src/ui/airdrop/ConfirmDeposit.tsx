import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import Button from "./common/Button";
import { TrackCurrentAirDropStepI } from "./hooks/useTrackAirdropSteps";

interface ConfirmDepositProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function ConfirmDeposit({
  updateCurrentStepStatus,
}: ConfirmDepositProps): ReactElement {
  function handleConfirm() {
    alert("handle confirm");
  }
  return (
    <div>
      <h1>confirm deposit</h1>
      <div className="flex justify-center gap-2 pt-10">
        <Button
          color="secondary"
          onClick={() => updateCurrentStepStatus(AIRDROP_STEPS.DEPOSIT)}
        >
          <ArrowLeftIcon className="w-4 h-4 fill-black" />
          Back
        </Button>
        <Button color="primary" onClick={handleConfirm}>
          Confirm
          <CheckIcon className="w-4 h-4 fill-white" />
        </Button>
      </div>
    </div>
  );
}
