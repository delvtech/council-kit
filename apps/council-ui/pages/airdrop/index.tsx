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
    <section className="mx-auto max-w-5xl flex flex-col justify-center gap-5 mt-10 text-center">
      <h1 className="text-4xl font-bold">Airdrop Claim</h1>
      <ul className="daisy-steps md:w-1/2 m-auto text-sm">
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
      <div className="mx-auto flex justify-center flex-col space-y-4">
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
      </div>
    </section>
  );
}
