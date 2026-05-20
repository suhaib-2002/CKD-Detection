import { useState } from "react";

/**
 * Custom hook to manage the state and navigation of a multi-step form.
 * 
 * @param steps - An array of React Elements representing the form steps.
 * @returns An object containing navigation functions and state booleans.
 */
export function useMultistep(steps: React.ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  /**
   * Navigate to the next step.
   * Prevents overflow beyond the last step.
   */
  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  /**
   * Navigate to the previous step.
   * Prevents overflow below the first step.
   */
  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  /**
   * Navigate to a specific step index.
   * @param index - The index of the step to navigate to.
   */
  function goTo(index: number) {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back,
  };
}
