"use client";

import { RefObject, useEffect, useState } from "react";

export default function useFocused(ref: RefObject<any>) {
  const [isFocused, setIsFocused] = useState(false);
  const [wasFocused, setWasFocused] = useState(false);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      setIsFocused(true);

      if ((e.relatedTarget as HTMLButtonElement)?.type === "submit") {
        setWasFocused(true);
      }
    };
    const handleBlur = () => {
      setIsFocused(false);
      setWasFocused(true);
    };

    if (ref.current) {
      ref.current.addEventListener("focus", handleFocus);
      ref.current.addEventListener("blur", handleBlur);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("focus", handleFocus);
        ref.current.removeEventListener("blur", handleBlur);
      }
    };
  }, []);

  return { isFocused, wasFocused };
}
