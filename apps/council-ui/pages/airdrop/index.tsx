import { ReactElement } from "react";

import classNames from "classnames";
import ClaimStep from "src/ui/airdrop/ClaimStep";
import ConfirmClaimStep from "src/ui/airdrop/ConfirmClaimStep";
import ConfirmDepositStep from "src/ui/airdrop/ConfirmDepositStep";
import DepositOrClaimStep from "src/ui/airdrop/DepositOrClaimStep";
import DepositStep from "src/ui/airdrop/DepositStep";
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
              <DepositStep
                onBack={() => goToStep("deposit-or-claim")}
                onNext={() => goToStep("confirm-deposit")}
              />
            );
          case "confirm-deposit":
            return <ConfirmDepositStep onBack={() => goToStep("deposit")} />;

          case "claim":
            return (
              <ClaimStep
                onBack={() => goToStep("deposit-or-claim")}
                onNext={() => goToStep("confirm-claim")}
              />
            );
          case "confirm-claim":
            return <ConfirmClaimStep onBack={() => goToStep("claim")} />;

          case "deposit-or-claim":
          default:
            return (
              <DepositOrClaimStep
                onDeposit={() => goToStep("deposit")}
                onClaim={() => goToStep("claim")}
              />
            );
        }
      })()}
    </section>
  );
}
