import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import { TrackCurrentAirDropStepI } from "./hooks/useAirdropSteps";

interface ConfirmDepositProps extends Partial<TrackCurrentAirDropStepI> {
  setCurrentStepStatus: TrackCurrentAirDropStepI["setCurrentStepStatus"];
}

export default function ConfirmDeposit({
  setCurrentStepStatus,
}: ConfirmDepositProps): ReactElement {
  function handleConfirm() {
    alert("handle confirm");
  }
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Deposit</h3>
      <input
        type="text"
        value="2,000 MVT"
        className="daisy-input daisy-input-bordered w-full max-w-xs text-center"
        disabled
      />
      <h3 className="text-lg font-bold">Credit To</h3>
      <input
        type="text"
        value="daryllau.eth"
        className="daisy-input daisy-input-bordered w-full max-w-xs text-center"
        disabled
      />
      <div className="flex justify-center gap-2 pt-10">
        <button
          className="daisy-btn gap-2 px-8"
          onClick={() => setCurrentStepStatus(AIRDROP_STEPS.DEPOSIT)}
        >
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2"
          onClick={handleConfirm}
        >
          Confirm
          <CheckIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
