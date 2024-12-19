"use client";

import { FormEvent, useState } from "react";

/**
 * Hook to keep track of form state
 * @param formAction the form action
 * @param initialState the initial state of the form
 */
export default function useFormState<T, U>(
  formAction: (input: U) => Promise<T>,
  initialState?: T,
  errorHandler?: (err: Error) => T,
) {
  const [formState, setFormState] = useState<T | undefined>(initialState);
  const [isPending, setIsPending] = useState(false);

  /**
   * To handle form submit event
   * @param e the form event object
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setIsPending(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    try {
      setFormState(await formAction(data as U));
    } catch (error) {
      if (error instanceof Error) {
        const errorData = errorHandler?.(error);

        setFormState(errorData);
      }
    }

    setIsPending(false);
  }

  return { formState, isPending, handleSubmit };
}
