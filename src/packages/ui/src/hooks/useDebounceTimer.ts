"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook for whenever element is focused
 */
export default function useDebounceTimer(
  value: any,
  preTimerCallback: () => void,
  postTimerCallback: () => Promise<void>,
  debounceMilliseconds: number,
) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    clearTimeout(debounceTimer.current);

    if (value !== undefined && value !== "") {
      setIsLoading(true);
    } else {
      return;
    }

    preTimerCallback();

    debounceTimer.current = setTimeout(async () => {
      if (value === undefined || value === "") {
        setIsLoading(false);
        return;
      }

      await postTimerCallback();

      setIsLoading(false);
    }, debounceMilliseconds);
  }, [value]);

  return { isLoading };
}
