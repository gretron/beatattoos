"use client";

import { useEffect, useState } from "react";

/**
 * Hook for whenever element is focused
 */
export default function useCopy(value: string) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timeoutCallback: number;

    if (isCopied) {
      timeoutCallback = setTimeout(
        () => setIsCopied(false),
        1000,
        "Reset Copy",
      );
    }

    return () => {
      clearTimeout(timeoutCallback);
    };
  }, [isCopied]);

  /**
   * Handle copy button click event
   */
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
    } catch (err) {
      console.error("ERROR: Error writing to clipboard: ", err);
    }
  };

  return { isCopied, handleCopyClick };
}
