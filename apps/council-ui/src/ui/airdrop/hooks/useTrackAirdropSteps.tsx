import { useEffect, useState } from "react";

import { AIRDROP_STEPS, CURRENT_STEP_KEY } from "pages/airdrop";

interface TrackCurrentAirDropStepI {
  currentStep: AIRDROP_STEPS;
  completedSteps: Array<AIRDROP_STEPS>;
  updateCurrentStepStatus: (currentStep: AIRDROP_STEPS) => void;
}

export default function useTrackCurrentAirdropStep(): TrackCurrentAirDropStepI {
  const persistedCurrentStep = parseInt(
    localStorage.getItem(CURRENT_STEP_KEY) as string,
  ) as AIRDROP_STEPS;

  //current active step that the user is present on
  const [currentStep, setCurrentStep] = useState<AIRDROP_STEPS>(
    persistedCurrentStep ?? AIRDROP_STEPS.DEPOSIT_OR_CLAIM,
  );
  //list of steps that the user have completed following.
  const [completedSteps, setCompletedSteps] = useState<Array<AIRDROP_STEPS>>(
    [],
  );

  function updateCurrentStepStatus(currentStep: AIRDROP_STEPS) {
    localStorage.setItem(CURRENT_STEP_KEY, currentStep.toString());
    setCurrentStep(currentStep);
  }

  function updateCompletedSteps() {
    if (currentStep === AIRDROP_STEPS.DEPOSIT_OR_CLAIM) {
      setCompletedSteps([AIRDROP_STEPS.DEPOSIT_OR_CLAIM]);
    } else if (currentStep === AIRDROP_STEPS.CHOOSE_ACCOUNT) {
      setCompletedSteps([
        AIRDROP_STEPS.DEPOSIT_OR_CLAIM,
        AIRDROP_STEPS.CHOOSE_ACCOUNT,
      ]);
    } else if (currentStep === AIRDROP_STEPS.CONFIRM) {
      setCompletedSteps([
        AIRDROP_STEPS.DEPOSIT_OR_CLAIM,
        AIRDROP_STEPS.CHOOSE_ACCOUNT,
        AIRDROP_STEPS.CONFIRM,
      ]);
    }
  }

  useEffect(() => {
    //whenever the currentStep state changes/updates reset the completedSteps accordingly
    updateCompletedSteps();
  }, [currentStep]);
  return { currentStep, completedSteps, updateCurrentStepStatus };
}
