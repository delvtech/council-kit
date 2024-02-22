import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";

interface ClaimStepProps {
  recipient: string | undefined;
  setRecipient: (address: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ClaimStep({
  recipient,
  setRecipient,
  onBack,
  onNext,
}: ClaimStepProps): ReactElement {
  return (
    <>
      <div className="daisy-form-control w-full">
        <label className="daisy-label text-2xl font-bold" htmlFor="address">
          Address
        </label>
        <input
          className="daisy-input daisy-input-bordered w-full"
          type="text"
          name="address"
          id="address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <label className="daisy-label">
          <span className="daisy-label text-sm">
            The tokens will be sent to this address.
          </span>
        </label>
      </div>
      <div className="flex justify-center gap-2 sm:gap-4">
        <button className="daisy-btn grow gap-2" onClick={onBack}>
          <ArrowLeftIcon className="h-4 w-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary grow gap-2"
          disabled={!recipient}
          onClick={onNext}
        >
          Continue
          <ArrowRightIcon className="h-4 w-4 fill-current" />
        </button>
      </div>
    </>
  );
}
