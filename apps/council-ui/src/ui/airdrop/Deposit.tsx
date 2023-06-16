import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { ReactElement, useEffect, useState } from "react";

import { AIRDROP_STEPS } from "pages/airdrop";
import Input from "./common/Input";
import Label from "./common/Label";
import FirstTimeDeposit from "./FirstTimeDeposit";
import { TrackCurrentAirDropStepI } from "./hooks/useAirdropSteps";

interface DepositProps extends Partial<TrackCurrentAirDropStepI> {
  updateCurrentStepStatus: TrackCurrentAirDropStepI["updateCurrentStepStatus"];
}

export default function Deposit({ ...props }: DepositProps): ReactElement {
  const [isFirstTimeDeposit, setIsFirstTimeDeposit] = useState(false);

  useEffect(() => {
    //perform some logic and update @isFirstTimeDeposit value.
    // setIsFirstTimeDeposit(true);
  }, []);

  if (isFirstTimeDeposit) {
    return <FirstTimeDeposit {...props} />;
  }

  return (
    <div className="min-w-[400px] text-start space-y-1">
      <Label htmlFor="address">Address</Label>
      <Input type="text" name="address" id="address" />
      <p className="text-xs">
        The tokens will be owned by this address in the locking vault.
      </p>
      <div className="flex justify-center gap-2 pt-10">
        <button
          className="daisy-btn gap-2 px-8"
          onClick={() =>
            props.updateCurrentStepStatus(AIRDROP_STEPS.DEPOSIT_OR_CLAIM)
          }
        >
          <ArrowLeftIcon className="w-4 h-4 fill-current" />
          Back
        </button>
        <button
          className="daisy-btn daisy-btn-primary gap-2"
          onClick={() =>
            props.updateCurrentStepStatus(AIRDROP_STEPS.CONFIRM_DEPOSIT)
          }
        >
          Continue
          <ArrowRightIcon className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
