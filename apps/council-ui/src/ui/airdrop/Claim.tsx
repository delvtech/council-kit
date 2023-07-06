import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";

interface ClaimProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Claim({ onBack, onNext }: ClaimProps): ReactElement {
  return (
    <>
      <div className="daisy-form-control w-full">
        <label className="daisy-label text-2xl font-bold" htmlFor="address">
          Address
        </label>
        <input
          className="w-full daisy-input-bordered daisy-input"
          type="text"
          name="address"
          id="address"
        />
        <label className="daisy-label">
          <span className="label-text-alt">
            The tokens will be sent to this address.
          </span>
        </label>
      </div>
      <div className="flex justify-center gap-2">
        <button className="daisy-btn gap-2 grow" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn-primary daisy-btn gap-2 grow"
          onClick={onNext}
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </>
  );
}
