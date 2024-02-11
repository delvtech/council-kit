import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import { ReactElement, useEffect, useState } from "react";
import ClaimStep from "src/ui/airdrop/ClaimStep";
import ConfirmClaimStep from "src/ui/airdrop/ConfirmClaimStep";
import ConfirmDepositStep from "src/ui/airdrop/ConfirmDepositStep";
import DepositOrClaimStep from "src/ui/airdrop/DepositOrClaimStep";
import DepositStep from "src/ui/airdrop/DepositStep";
import { useAirdropVault } from "src/ui/airdrop/hooks/useAirdropLockingVault";
import { useClaimAirdrop } from "src/ui/airdrop/hooks/useClaimAirdrop";
import { useClaimAndDelegateAirdrop } from "src/ui/airdrop/hooks/useClaimAndDelegateAirdrop";
import useRouterSteps from "src/ui/router/hooks/useRouterSteps";
import { useDelegate } from "src/ui/vaults/lockingVault/hooks/useDelegate";
import { zeroAddress } from "viem";
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
  const [recipientAddress, setRecipientAddress] = useState<string>();

  // The address to delegate to if the user chooses to deposit
  const [delegateAddress, setDelegateAddress] = useState<string>();

  // Determine if the user needs to choose a delegate
  const { airdropVault } = useAirdropVault();
  const { delegate: currentDelegate } = useDelegate({
    account: recipientAddress as `0x${string}`,
    vault: airdropVault,
  });
  const needsDelegate =
    currentDelegate && currentDelegate.address === zeroAddress;

  // Set the recipient and delegate addresses to the connected wallet if they
  // haven't been set yet
  const account = useAccount();
  useEffect(() => {
    setRecipientAddress((previousValue) => previousValue || account.address);
    setDelegateAddress((previousValue) => previousValue || account.address);
  }, [account.address]);

  const { claimAirdrop, hasClaimableAirdrop } = useClaimAirdrop();
  const { claimAndDelegateAirdrop } = useClaimAndDelegateAirdrop();

  return (
    <section className="mx-auto mt-14 box-content flex max-w-lg flex-col justify-center gap-16 px-[6vw] text-center">
      <div className="flex flex-col justify-center gap-8">
        <h1 className="text-5xl font-bold">Airdrop Claim</h1>
        <ul className="daisy-steps m-auto w-full text-sm">
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
        if (!account) {
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
            return (
              <ConfirmDepositStep
                account={recipientAddress}
                delegate={delegateAddress}
                onBack={() => goToStep("deposit")}
                onConfirm={
                  claimAndDelegateAirdrop
                    ? () =>
                        claimAndDelegateAirdrop({
                          recipient: recipientAddress as `0x${string}`,
                          delegate: delegateAddress as `0x${string}`,
                        })
                    : undefined
                }
              />
            );
          case "claim":
            return (
              <ClaimStep
                recipient={recipientAddress}
                setRecipient={setRecipientAddress}
                onBack={() => goToStep("deposit-or-claim")}
                onNext={() => goToStep("confirm-claim")}
              />
            );
          case "confirm-claim":
            return (
              <ConfirmClaimStep
                recipient={recipientAddress}
                onBack={() => goToStep("claim")}
                onConfirm={
                  claimAirdrop
                    ? () =>
                        claimAirdrop({
                          recipient: recipientAddress as `0x${string}`,
                        })
                    : undefined
                }
              />
            );

          case "deposit-or-claim":
          default:
            return (
              <DepositOrClaimStep
                onDeposit={
                  hasClaimableAirdrop ? () => goToStep("deposit") : undefined
                }
                onClaim={
                  hasClaimableAirdrop ? () => goToStep("claim") : undefined
                }
              />
            );
        }
      })()}
    </section>
  );
}
