import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { AIRDROP_STEPS } from "pages/airdrop";
import { ReactElement } from "react";
import Input from "./common/Input";
import Label from "./common/Label";
import { TrackCurrentAirDropStepI } from "./hooks/useAirdropSteps";

interface FirstTimeProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function FirstTimeDeposit({
  updateCurrentStepStatus,
}: FirstTimeProps): ReactElement {
  return (
    <div className="min-w-[400px] text-start space-y-1">
      <form className="py-3">
        <Label htmlFor="address">Address</Label>
        <Input type="text" name="address" id="address" />
        <p className="text-xs mt-2">
          The tokens will be owned by this address in the locking vault.
        </p>
        <Label htmlFor="address">Delegate</Label>
        <Input type="text" name="address" id="address" />
        <p className="text-xs mt-2">
          The resulting voting power will be usable by this address. This can be
          changed at any time.
        </p>
      </form>
      <Link
        className="flex items-center gap-1 underline underline-offset-2 text-xs"
        href="#"
      >
        View all voters <ArrowTopRightOnSquareIcon className="h-5 w-4" />
      </Link>
      <Link
        className="flex items-center gap-1 underline underline-offset-2 text-xs"
        href="#"
      >
        Explore delegate profiles
        <ArrowTopRightOnSquareIcon className="h-5 w-4" />
      </Link>
      <div className="flex justify-center gap-2 pt-10">
        <button
          className="daisy-btn gap-2 px-8"
          onClick={() =>
            updateCurrentStepStatus(AIRDROP_STEPS.DEPOSIT_OR_CLAIM)
          }
        >
          <ArrowLeftIcon className="w-4 h-4 fill-white" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2"
          onClick={() =>
            updateCurrentStepStatus(AIRDROP_STEPS.FIRST_TIME_DEPOSIT_CONFIRM)
          }
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
}
