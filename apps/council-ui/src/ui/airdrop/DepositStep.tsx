import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { ReactElement } from "react";

interface DepositStepProps {
  account: string;
  setAccount: (account: string) => void;
  delegate?: string;
  setDelegate?: (delegate: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function DepositStep({
  account,
  setAccount,
  delegate,
  setDelegate,
  onBack,
  onNext,
}: DepositStepProps): ReactElement {
  return (
    <>
      <div className="space-y-6 text-left">
        <div className="daisy-form-control w-full">
          <label className="daisy-label text-2xl font-bold" htmlFor="account">
            Account
          </label>
          <input
            className="w-full daisy-input-bordered daisy-input"
            type="text"
            name="account"
            id="account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <label className="daisy-label text-sm">
            The tokens will be owned by this address in the locking vault.
          </label>
        </div>
        {setDelegate && (
          <div className="daisy-form-control w-full">
            <label className="daisy-label text-2xl font-bold" htmlFor="account">
              Delegate
            </label>
            <input
              className="w-full daisy-input-bordered daisy-input"
              type="text"
              name="account"
              id="account"
              value={delegate}
              // readOnly={!setDelegate}
              onChange={(e) => setDelegate(e.target.value)}
            />
            <label className="daisy-label text-sm">
              The resulting voting power will be usable by this address. This
              can be changed at any time.
            </label>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-2">
        <button className="daisy-btn gap-2 grow" onClick={onBack}>
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2 grow"
          onClick={onNext}
          disabled={!account || (setDelegate && !delegate)}
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </>
  );
}
