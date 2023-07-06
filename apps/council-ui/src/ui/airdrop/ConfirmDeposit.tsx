import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";

interface ConfirmDepositProps {
  onBack: () => void;
}

export default function ConfirmDeposit({
  onBack,
}: ConfirmDepositProps): ReactElement {
  function handleConfirm() {
    alert("handle confirm");
  }
  return (
    <>
      <div className="daisy-stats daisy-stats-vertical">
        <div className="daisy-stat bg-base-200">
          <div className="daisy-stat-title">Deposit</div>
          <div className="daisy-stat-value">2,000 MVT</div>
        </div>
        <div className="daisy-stat bg-base-200">
          <div className="daisy-stat-title">Credited To</div>
          <div className=" daisy-stat-value">daryllau.eth</div>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button className="daisy-btn gap-2 grow" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2 grow"
          onClick={handleConfirm}
        >
          <CheckIcon className="w-4 h-4 fill-current" />
          Confirm
        </button>
      </div>
    </>
  );
}
