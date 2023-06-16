import { useEffect, useState } from "react";

import { AIRDROP_STEPS } from "pages/airdrop";

export interface TrackCurrentAirDropStepI {
  currentStep: AIRDROP_STEPS;
  completedSteps: Array<AIRDROP_STEPS>;
  updateCurrentStepStatus: (currentStep: AIRDROP_STEPS) => void;
}

export default function useAirdropSteps(): TrackCurrentAirDropStepI {
  //TBD:
  // const persistedCurrentStep = parseInt(
  //   localStorage.getItem(CURRENT_STEP_KEY) as string,
  // ) as AIRDROP_STEPS;

  const persistedCurrentStep = null;
  //current active step that the user is present on
  const [currentStep, setCurrentStep] = useState<AIRDROP_STEPS>(
    persistedCurrentStep ?? AIRDROP_STEPS.DEPOSIT_OR_CLAIM,
  );
  //list of steps that the user have completed following.
  const [completedSteps, setCompletedSteps] = useState<Array<AIRDROP_STEPS>>(
    [],
  );

  function updateCurrentStepStatus(_currentStep: AIRDROP_STEPS) {
    // localStorage.setItem(CURRENT_STEP_KEY, _currentStep.toString());
    setCurrentStep(_currentStep);
  }

  function updateCompletedSteps() {
    if (currentStep === AIRDROP_STEPS.DEPOSIT_OR_CLAIM) {
      setCompletedSteps([1]);
    } else if (
      currentStep === AIRDROP_STEPS.DEPOSIT ||
      currentStep === AIRDROP_STEPS.CLAIM ||
      currentStep === AIRDROP_STEPS.FIRST_TIME_DEPOSIT
    ) {
      setCompletedSteps([1, 2]);
    } else if (
      currentStep === AIRDROP_STEPS.CONFIRM_CLIAM ||
      currentStep === AIRDROP_STEPS.CONFIRM_DEPOSIT ||
      currentStep === AIRDROP_STEPS.FIRST_TIME_DEPOSIT_CONFIRM
    ) {
      setCompletedSteps([1, 2, 3]);
    }
  }

  useEffect(() => {
    //whenever the currentStep state changes/updates reset the completedSteps accordingly
    updateCompletedSteps();
  }, [currentStep]);
  return { currentStep, completedSteps, updateCurrentStepStatus };
}
