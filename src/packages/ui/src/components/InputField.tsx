"use client";

import "../styles/globals.css";
import Field, { RequiredFieldProps } from "./Field";
import { forwardRef, ReactNode, Ref, RefObject, useRef } from "react";
import useFocused from "../hooks/useFocused";
import useValidity from "../hooks/useValidity";

interface InputFieldProps<T> extends RequiredFieldProps {
  placeholder: string;
  disabled?: boolean;
  type?: string;
  value: string;
  setValue: (value: string) => void;
  validationValue?: T;
  inputPrependNode?: ReactNode;
  inputAppendNode?: ReactNode;
}

function InputFieldComponent<T>(
  props: InputFieldProps<T>,
  forwardRef?: Ref<HTMLInputElement>,
) {
  const ref = useRef<HTMLInputElement>(null);
  const { wasFocused } = useFocused(
    (forwardRef as RefObject<HTMLInputElement>) ?? ref,
  );
  const { isValid, message } = useValidity<T | string>(
    props.validationValue ?? props.value,
    props.required ?? false,
    props.schema,
    (forwardRef as RefObject<HTMLInputElement>) ?? ref,
  );

  return (
    <Field {...props} errorMessage={wasFocused ? message : undefined}>
      <div className={"flex grow items-center relative"}>
        {props.inputPrependNode}
        <input
          ref={forwardRef ?? ref}
          id={props.id}
          type={props.type}
          name={props.name}
          className={`peer ${wasFocused ? "was-focused" : ""} 
            bg-clip-text autofill:disabled:shadow-[0_0_0_9999px_#C8A797_inset] 
            placeholder:text-neutral-400 bg-transparent 
            outline-none p-3 relative w-full z-10 
            disabled:text-neutral-500 rounded-2xl transition-all`}
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
        {props.inputAppendNode}
      </div>
    </Field>
  );
}

const InputField = forwardRef(InputFieldComponent) as <T>(
  props: InputFieldProps<T> & { ref?: Ref<HTMLInputElement> },
) => ReturnType<typeof InputFieldComponent>;

export default InputField;
