"use client";

import { useEffect, useMemo, useState } from "react";
import { ZodType } from "zod";

export default function useValidity<T>(
  value: T,
  required: boolean,
  schema?: ZodType,
  ref?: React.RefObject<HTMLElement>,
) {
  const [message, setMessage] = useState<string>("");

  const isValid = useMemo<boolean>(() => {
    if (!schema || !required) {
      return true;
    }

    const parsedValue = schema.safeParse(value);

    parsedValue.success
      ? setMessage("")
      : setMessage(parsedValue.error.issues[0]?.message ?? "");

    return parsedValue.success;
  }, [value, schema]);

  useEffect(() => {
    if (!required) {
      setMessage("");
    }
  }, [required]);

  useEffect(() => {
    if (ref?.current) {
      (ref?.current as HTMLInputElement).setCustomValidity(message);
    }
  }, [message]);

  return { message, isValid };
}
