import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { ReactElement, useEffect, useState } from "react";

interface DepositProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Deposit({
  onBack,
  onNext,
}: DepositProps): ReactElement {
  const [isFirstTimeDeposit, setIsFirstTimeDeposit] = useState(true);

  useEffect(() => {
    //perform some logic and update @isFirstTimeDeposit value.
    // setIsFirstTimeDeposit(true);
  }, []);

  return (
    <>
      <div className="daisy-form-control w-full">
        <label className="daisy-label text-2xl font-bold" htmlFor="account">
          Account
        </label>
        <input
          className="w-full daisy-input-bordered daisy-input"
          type="text"
          name="account"
          id="account"
        />
        <label className="daisy-label">
          <span className="label-text-alt">
            The tokens will be owned by this address in the locking vault.
          </span>
        </label>
      </div>
      <div className="flex justify-center gap-2">
        <button className="daisy-btn gap-2 grow" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2 grow"
          onClick={onNext}
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </>
  );
}
