"use client";

import { useEffect, useState } from "react";

/**
 * Hook to optimistically update states
 */
export default function useOptimisticState<T>(
  state: T[],
  updateState: (currentState: T[], optimisticValue: T) => T[],
) {
  const [optimisticState, setOptimisticState] = useState(state);

  /**
   * To add optimistic value to optimistic state
   * @param value the optimistic value to add
   */
  function addOptimisticValue(value: T) {
    setOptimisticState(updateState(state, value));
  }

  /**
   * To update optimistic state with new value
   * @param newValue the value to update the optimistic state with
   * @param find a function to find which value to update
   */
  function updateOptimisticState(newValue: T, find: (current: T) => boolean) {
    let found = false;

    const updatedState = optimisticState.map((optimisticValue) => {
      if (!found && find(optimisticValue)) {
        found = true;
        return newValue;
      }

      return optimisticValue;
    });

    setOptimisticState(updatedState);
  }

  /**
   * To remove optimistic value from optimistic state if optimistic operation fails
   * @param value the optimistic value to remove
   */
  function removeOptimisticValue(value: T) {
    setOptimisticState(
      optimisticState.filter((optimisticValue) => optimisticValue !== value),
    );
  }

  useEffect(() => {
    // If actual state changes, update optimistic state
    setOptimisticState(state);
  }, [state]);

  return {
    optimisticState,
    addOptimisticValue,
    updateOptimisticState,
    removeOptimisticValue,
  };
}
