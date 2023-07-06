import { ReactElement } from "react";

import classNames from "classnames";
import Claim from "src/ui/airdrop/Claim";
import ConfirmClaim from "src/ui/airdrop/ConfirmClaim";
import ConfirmDeposit from "src/ui/airdrop/ConfirmDeposit";
import Deposit from "src/ui/airdrop/Deposit";
import DepositOrClaim from "src/ui/airdrop/DepositOrClaim";
import useRouterSteps from "src/ui/router/useRouterSteps";

export default function AirdropPage(): ReactElement {
  const { currentStep, goToStep, getStepNumber } = useRouterSteps({
    steps: [
      "deposit-or-claim",
      ["claim", "deposit"],
      ["confirm-claim", "confirm-deposit"],
    ],
  });

  return (
    <section className="mx-auto max-w-lg flex flex-col justify-center gap-16 mt-14 text-center">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="text-5xl font-bold">Airdrop Claim</h1>
        <ul className="daisy-steps m-auto text-sm w-full">
          <li
            data-content="1"
            className={classNames("daisy-step", {
              "daisy-step-primary": getStepNumber(currentStep) >= 1,
              // "daisy-step-primary": stepsUtils.completedSteps.includes(1),
            })}
          >
            Deposit or Claim
          </li>
          <li
            data-content="2"
            className={classNames("daisy-step", {
              "daisy-step-primary": getStepNumber(currentStep) >= 2,
            })}
          >
            Choose account
          </li>
          <li
            data-content="3"
            className={classNames("daisy-step", {
              "daisy-step-primary": getStepNumber(currentStep) >= 3,
            })}
          >
            Confirm
          </li>
        </ul>
      </div>
      {(() => {
        switch (currentStep) {
          case "deposit":
            return (
              <Deposit
                onBack={() => goToStep("deposit-or-claim")}
                onNext={() => goToStep("confirm-deposit")}
              />
            );
          case "confirm-deposit":
            return <ConfirmDeposit onBack={() => goToStep("deposit")} />;

          case "claim":
            return (
              <Claim
                onBack={() => goToStep("deposit-or-claim")}
                onNext={() => goToStep("confirm-claim")}
              />
            );
          case "confirm-claim":
            return <ConfirmClaim onBack={() => goToStep("claim")} />;

          case "deposit-or-claim":
          default:
            return (
              <DepositOrClaim
                onDeposit={() => goToStep("deposit")}
                onClaim={() => goToStep("claim")}
              />
            );
        }
      })()}
    </section>
  );
}
