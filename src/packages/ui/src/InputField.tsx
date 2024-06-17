"use client";

import "./styles/globals.css";
import Field, { RequiredFieldProps } from "./Field";
import { useEffect, useRef } from "react";
import useFocused from "./hooks/useFocused";
import useValidity from "./hooks/useValidity";

interface InputFieldProps<T> extends RequiredFieldProps {
  id: string;
  placeholder: string;
  disabled?: boolean;
  value: string;
  setValue: (value: string) => void;
  validationValue?: T;
}

export default function InputField<T>(props: InputFieldProps<T>) {
  const ref = useRef<HTMLInputElement>(null);
  const { wasFocused } = useFocused(ref);
  const { isValid, message } = useValidity<T | string>(
    props.validationValue ?? props.value,
    props.required ?? false,
    props.schema,
    ref,
  );

  return (
    <Field
      className={props.className}
      heading={props.heading}
      subheading={props.subheading}
      required={props.required}
      errorMessage={wasFocused ? message : undefined}
    >
      <div className={"relative mt-2"}>
        <input
          ref={ref}
          id={props.id}
          name={props.name}
          className={`peer ${wasFocused ? "was-focused" : ""} bg-clip-text autofill:disabled:shadow-[0_0_0_9999px_#C8A797_inset] placeholder:text-neutral-400 bg-transparent outline-none p-3 relative w-full z-10 disabled:text-neutral-500 rounded-2xl transition-all`}
          value={props.value}
          disabled={props.disabled}
          required={props.required}
          onChange={(e) => props.setValue(e.target.value)}
          placeholder={props.placeholder}
        />
        <label
          htmlFor={props.id}
          className={
            "absolute peer-[.was-focused]:peer-invalid:outline-error-500 " +
            "top-0 left-0 w-full h-full outline outline-1 outline-neutral-400 " +
            "rounded-2xl peer-autofill:bg-[#E8F0FE] peer-focus:outline-neutral-500 " +
            "peer-disabled:outline-neutral-500 peer-disabled:bg-neutral-400 " + // Disabled classes
            "peer-disabled:peer-autofill:outline-neutral-500 peer-disabled:peer-autofill:bg-neutral-400 " + // Disabled + autofill classes
            "transition-all"
          }
        />
      </div>
    </Field>
  );
}
