import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";

interface ClaimProps {
  onBack: () => void;
  onNext: () => void;
}

export default function Claim({ onBack, onNext }: ClaimProps): ReactElement {
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
        <button className="daisy-btn gap-2 px-8" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button className="daisy-btn-primary daisy-btn gap-2" onClick={onNext}>
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
