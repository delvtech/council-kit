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
import { useParams } from "src/ui/router/hooks/useParams";

export type StepPosition = "behind" | "current" | "adjacent" | "ahead";

interface UseRouterStepsOptions<T extends string> {
  /**
   * The URL parameter name to use for the steps. Defaults to "step".
   */
  paramName?: string;

  /**
   * The steps in the flow. Each step can be a single value or an array of
   * values for steps that have alternative paths. Steps are 1-indexed.
   *
   * @example
   * // A flow with 3 steps
   * steps: ["step1", "step2", "step3"]
   *
   * // A flow with 3 steps where step 2 has 2 alternative paths
   * steps: ["step1", ["step2a", "step2b"], "step3"]
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
  /**
   * Returns true for all steps up to and including the step after the last
   * completed step. The step must be a valid step number or a step in the steps
   * array.
   */
  canViewStep: (step: number | T) => boolean;

  /**
   * The number of steps considered complete.
   */
  completedSteps: number;

  /**
   * Complete a single step. This will not navigate to a new step.
   */
  completeStep: (step: number | T) => void;

  /**
   * The current step. This will be the same as `currentStepNumber` if no
   * `steps` option was provided.
   */
  currentStep: T;

  /**
   * The number of the current step in the flow.
   *
   * @example
   * const steps = ["step1", ["step2a", "step2b"], "step3"];
   *
   * switch (currentStep) {
   *   case "step1":
   *     return 1;
   *   case "step2a":
   *   case "step2b":
   *     return 2;
   *   case "step3":
   *     return 3;
   * }
   */
  currentStepNumber: number;

  /**
   * Get the number of a step in the flow. Returns 0 if the step is not in the
   * flow.
   */
  getStepNumber: (step: number | T) => number;

  /**
   * Get the router path for a step.
   */
  getStepPath: (step: number | T) => string;

  /**
   * Get the position of a step in the flow. If the step's number is less than
   * the current step's number, It's `behind`. If It's greater than the current
   * step's number, It's `ahead`. If the numbers are the same, but the steps are
   * different, It's `adjacent`. Otherwise, it's `current`.
   */
  getStepPosition: (step: number | T) => StepPosition | undefined;

  /**
   * Complete the current step and navigate to the next step in the flow. If the
   * next step has multiple paths, it will go to the first path.
   */
  goToNextStep: () => void;

  /**
   * Navigate to the previous step in the flow. If the previous step has
   * multiple paths, it will go to the first path.
   */
  goToPreviousStep: () => void;

  /**
   * Complete all steps up to a given step and navigate to that step.
   */
  goToStep: (step: number | T) => void;

  /**
   * Set the number of completed steps. This will not navigate to a new step.
   * This is useful for when you want to persist the completed steps across
   * sessions, skip steps, or reset steps for a new path.
   */
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

  const currentStepNumber = useMemo(
    () => getStepNumber(currentStep),
    [currentStep, getStepNumber],
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

  const getStepPosition = useCallback(
    (step: number | T): StepPosition | undefined => {
      // if the step is the current step, it is `current`
      if (step === currentStep) {
        return "current";
      }

      const stepNumber = getStepNumber(step);
      const currentStepNumber = getStepNumber(currentStep);

      if (stepNumber === currentStepNumber) {
        return "adjacent";
      }
      if (stepNumber > currentStepNumber) {
        return "ahead";
      }
      if (stepNumber > 0 && stepNumber < currentStepNumber) {
        return "behind";
      }
    },
    [getStepNumber, currentStep],
  );

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
    currentStepNumber,
    getStepNumber,
    getStepPath,
    getStepPosition,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    setCompletedSteps,
  };
}
