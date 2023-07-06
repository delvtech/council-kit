import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "src/ui/router/useParams";

export type StepStatus = "complete" | "current" | "pending";

interface UseRouterStepsOptions<T extends string> {
  /**
   * The URL parameter name to use for the steps. Defaults to "step".
   */
  paramName?: string;
  /**
   * The steps in the process. Each step can be a single value or an array of
   * values for steps that have alternative paths. Steps are 1-indexed.
   */
  steps?: (T | T[])[];
  /**
   * The number of initially completed steps. Defaults to 0.
   */
  initialCompleted?: number;
}

/**
 * A custom hook to control routing in a multi-step process. It provides the
 * functionality to keep track of the current step, the completed steps, and
 * navigate to different steps.
 *
 * @template T The type of steps. Can be a string or any type that extends
 * string. For example, it can be a string union type to create a type-safe step
 * navigation.
 */
export default function useRouterSteps<T extends string = string>(
  options?: UseRouterStepsOptions<T>,
): {
  canViewStep: (step: number | T) => boolean;
  completedSteps: number;
  completeStep: (step: number | T) => void;
  currentStep: T;
  getStepNumber: (step: number | T) => number;
  getStepPath: (step: number | T) => string;
  getStepStatus: (step: number | T) => StepStatus;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number | T) => void;
  setCompletedSteps: Dispatch<SetStateAction<number>>;
} {
  // using useRef to ensure these values never trigger rerenders when changed
  const {
    paramName = "step",
    initialCompleted = 0,
    steps,
  } = useRef<UseRouterStepsOptions<T>>(options || {}).current;

  const { pathname, push, replace } = useRouter();
  const { [paramName]: paramStep } = useParams();

  // use these methods in dependency arrays
  const staticRouterMethods = useRef({ safePush: push, safeReplace: replace });
  const { safePush, safeReplace } = staticRouterMethods.current;

  const [completedSteps, setCompletedSteps] = useState(initialCompleted);

  /**
   * Returns the current step. If the step is a number, it is returned as is.
   * If the step is not a number, it is looked up in the steps array. If the
   * step is not in the steps array, the first step is returned.
   */
  const currentStep = useMemo(() => {
    if (steps) {
      if (paramStep) {
        return paramStep as T;
      }
      if (Array.isArray(steps[0])) {
        return steps[0][0];
      }
      return steps[0];
    }
    return (paramStep ? parseInt(paramStep) : 1) as unknown as T;
  }, [paramStep, steps]);

  /**
   * Returns the step number of the given step. If the step is a number, it is
   * returned as is. If the step is not a number, the index is looked up in the
   * steps array. If the step is not in the steps array, 0 is returned.
   */
  const getStepNumber = useCallback(
    (step: number | T) => {
      if (typeof step === "number") {
        return step;
      }
      if (steps) {
        return (
          steps.findIndex((_step) =>
            Array.isArray(_step) ? _step.includes(step) : _step === step,
          ) + 1
        );
      }
      return 0;
    },
    [steps],
  );

  const getStepPath = useCallback(
    (step: number | T) => {
      const pathStart = `${pathname}?${paramName}=`;

      if (steps && typeof step === "number") {
        const stepLabel = steps[step - 1];
        if (Array.isArray(stepLabel)) {
          return `${pathStart}${stepLabel[0]}`;
        }

        return `${pathStart}${stepLabel}`;
      }

      return `${pathStart}${step}`;
    },
    [pathname, paramName, steps],
  );

  /**
   * Returns the status of the step. If the step is less than the current step,
   * it is complete. If it is greater than the current step, it is pending.
   * Otherwise, it is the current step.
   */
  const getStepStatus = useCallback(
    (step: number | T): StepStatus => {
      if (getStepNumber(step) < getStepNumber(currentStep)) {
        return "complete";
      }
      if (getStepNumber(step) > getStepNumber(currentStep)) {
        return "pending";
      }
      return "current";
    },
    [getStepNumber, currentStep],
  );

  /**
   * Returns true if the step is one of the following:
   *  - greater than 0
   * - less than or equal to the step after the last completed one
   * - is a number or in steps
   */
  const canViewStep = useCallback(
    (step: number | T) => {
      const stepNumber = getStepNumber(step);
      return stepNumber > 0 && stepNumber <= completedSteps + 1;
    },
    [getStepNumber, completedSteps],
  );

  const completeStep = useCallback(
    (step: number | T) => {
      setCompletedSteps((completedSteps) =>
        Math.max(completedSteps, getStepNumber(step)),
      );
    },
    [getStepNumber],
  );

  /**
   * Completes all steps up to a given step and navigates to that step.
   */
  const goToStep = useCallback(
    (step: number | T) => {
      completeStep(getStepNumber(step) - 1);
      safePush(getStepPath(step));
    },
    [safePush, getStepPath, completeStep, getStepNumber],
  );

  const goToPreviousStep = useCallback(() => {
    goToStep(getStepNumber(currentStep) - 1);
  }, [goToStep, getStepNumber, currentStep]);

  const goToNextStep = useCallback(() => {
    goToStep(getStepNumber(currentStep) + 1);
  }, [goToStep, getStepNumber, currentStep]);

  useEffect(() => {
    if (!canViewStep(currentStep)) {
      // TODO: error notification?
      safeReplace(getStepPath(completedSteps + 1), undefined, {
        shallow: true,
      });
    }
  }, [
    paramStep,
    canViewStep,
    currentStep,
    safeReplace,
    getStepPath,
    completedSteps,
  ]);

  return {
    canViewStep,
    completedSteps,
    completeStep,
    currentStep,
    getStepNumber,
    getStepPath,
    getStepStatus,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    setCompletedSteps,
  };
}
