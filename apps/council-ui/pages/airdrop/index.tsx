import { ReactElement } from "react";

import classNames from "classnames";
import Cliam from "src/ui/airdrop/Cliam";
import ConfirmCliam from "src/ui/airdrop/ConfirmCliam";
import ConfirmDeposit from "src/ui/airdrop/ConfirmDeposit";
import ConfirmFirstTimeDeposit from "src/ui/airdrop/ConfirmFirstTimeDepost";
import DepositOrCliam from "src/ui/airdrop/DeopistOrCliam";
import Deposit from "src/ui/airdrop/Deposit";
import FirstTimeDeposit from "src/ui/airdrop/FirstTimeDeposit";
import useTrackCurrentAirdropStep from "src/ui/airdrop/hooks/useTrackAirdropSteps";

export enum AIRDROP_STEPS {
  DEPOSIT_OR_CLAIM = 1,
  CLAIM = 2,
  CONFIRM_CLIAM = 3,
  DEPOSIT = 4,
  CONFIRM_DEPOSIT = 5,
  FIRST_TIME_DEPOSIT = 6,
  FIRST_TIME_DEPOSIT_CONFIRM = 7,
}

export const CURRENT_STEP_KEY = "current_airdrop_step";

export default function AirdropPage(): ReactElement {
  const stepsUtils = useTrackCurrentAirdropStep();

  return (
    <section className="mx-auto max-w-lg flex flex-col justify-center gap-5 mt-10 text-center">
      <h1 className="text-4xl font-bold">Airdrop Claim</h1>
      <ul className="daisy-steps md:w-1/2 m-auto text-sm">
        <li
          data-content="1"
          className={classNames("daisy-step", {
            "daisy-step-neutral": stepsUtils.completedSteps.includes(1),
          })}
        >
          Deposit or Claim
        </li>
        <li
          data-content="2"
          className={classNames("daisy-step", {
            "daisy-step-neutral": stepsUtils.completedSteps.includes(2),
          })}
        >
          Choose account
        </li>
        <li
          data-content="3"
          className={classNames("daisy-step", {
            "daisy-step-neutral": stepsUtils.completedSteps.includes(3),
          })}
        >
          Confirm
        </li>
      </ul>
      <div className="mx-auto flex justify-center flex-col space-y-4">
        {(() => {
          switch (stepsUtils.currentStep) {
            case AIRDROP_STEPS.DEPOSIT_OR_CLAIM:
              return <DepositOrCliam {...stepsUtils} />;
            case AIRDROP_STEPS.CLAIM:
              return <Cliam {...stepsUtils} />;
            case AIRDROP_STEPS.CONFIRM_CLIAM:
              return <ConfirmCliam {...stepsUtils} />;
            case AIRDROP_STEPS.DEPOSIT:
              return <Deposit {...stepsUtils} />;
            case AIRDROP_STEPS.CONFIRM_DEPOSIT:
              return <ConfirmDeposit {...stepsUtils} />;
            case AIRDROP_STEPS.FIRST_TIME_DEPOSIT:
              return <FirstTimeDeposit {...stepsUtils} />;
            case AIRDROP_STEPS.FIRST_TIME_DEPOSIT_CONFIRM:
              return <ConfirmFirstTimeDeposit {...stepsUtils} />;
            default:
              return null;
          }
        })()}
      </div>
    </section>
  );
}
