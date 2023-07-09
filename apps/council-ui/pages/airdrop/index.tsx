import { ReactElement, useEffect, useState } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import { constants } from "ethers";
import ClaimStep from "src/ui/airdrop/ClaimStep";
import ConfirmClaimStep from "src/ui/airdrop/ConfirmClaimStep";
import ConfirmDepositStep from "src/ui/airdrop/ConfirmDepositStep";
import DepositOrClaimStep from "src/ui/airdrop/DepositOrClaimStep";
import DepositStep from "src/ui/airdrop/DepositStep";
import { useAirdropLockingVault } from "src/ui/airdrop/hooks/useAirdropLockingVault";
import useRouterSteps from "src/ui/router/useRouterSteps";
import { useDelegate } from "src/ui/vaults/lockingVault/hooks/useDelegate";
import { useAccount } from "wagmi";

export default function AirdropPage(): ReactElement {
  // Utilities to help with routing between steps
  const { currentStep, currentStepNumber, goToStep } = useRouterSteps({
    steps: [
      "deposit-or-claim",
      ["claim", "deposit"],
      ["confirm-claim", "confirm-deposit"],
    ],
  });

  // The address that will receive the airdrop
  const [recipientAddress, setRecipientAddress] = useState("");

  // The address to delegate to if the user chooses to deposit
  const [delegateAddress, setDelegateAddress] = useState("");

  // Determine if the user needs to choose a delegate
  const { data: lockingVault } = useAirdropLockingVault();
  const { data: currentDelegate } = useDelegate(
    lockingVault?.address,
    recipientAddress,
  );
  const needsDelegate =
    currentDelegate && currentDelegate.address === constants.AddressZero;

  // Set the recipient and delegate addresses to the connected wallet if they
  // haven't been set yet
  const { address } = useAccount();
  useEffect(() => {
    setRecipientAddress((previousValue) => previousValue || address || "");
    setDelegateAddress((previousValue) => previousValue || address || "");
  }, [address]);

  return (
    <section className="mx-auto max-w-lg flex flex-col justify-center gap-16 mt-14 text-center">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="text-5xl font-bold">Airdrop Claim</h1>
        <ul className="daisy-steps m-auto text-sm w-full">
          <li
            data-content="1"
            className={classNames("daisy-step", {
              "daisy-step-primary": currentStepNumber >= 1,
            })}
          >
            Deposit or Claim
          </li>
          <li
            data-content="2"
            className={classNames("daisy-step", {
              "daisy-step-primary": currentStepNumber >= 2,
            })}
          >
            Choose account
          </li>
          <li
            data-content="3"
            className={classNames("daisy-step", {
              "daisy-step-primary": currentStepNumber >= 3,
            })}
          >
            Confirm
          </li>
        </ul>
      </div>
      {(() => {
        if (!address) {
          return (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          );
        }

        switch (currentStep) {
          case "deposit":
            return (
              <DepositStep
                account={recipientAddress}
                setAccount={setRecipientAddress}
                delegate={delegateAddress}
                setDelegate={needsDelegate ? setDelegateAddress : undefined}
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
