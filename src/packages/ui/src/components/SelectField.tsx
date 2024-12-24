"use client";

import { ReactNode, useRef } from "react";
import Field, { RequiredFieldProps } from "./Field";
import useFocused from "../hooks/useFocused";
import useValidity from "../hooks/useValidity";
import IconDropdown from "./IconDropdown";
import { IconLoader } from "@tabler/icons-react";

/**
 * Options for select fields
 */
export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Props for {@link SelectField}
 */
export interface SelectFieldProps extends RequiredFieldProps {
  placeholder: string;
  disabled?: boolean;
  options: SelectOption[];
  value: string;
  setValue: (value: string) => void;
  isLoading?: boolean;
  inputPrependNode?: ReactNode;
  inputAppendNode?: ReactNode;
}

/**
 * Field to select options
 */
export default function SelectField(props: SelectFieldProps) {
  const ref = useRef<HTMLSelectElement>(null);
  const { wasFocused } = useFocused(ref);
  const { isValid, message } = useValidity<string>(
    props.value,
    props.required ?? false,
    props.schema,
    ref,
  );

  return (
    <Field {...props} errorMessage={wasFocused ? message : undefined}>
      <div className={"relative"}>
        <select
          ref={ref}
          id={props.id}
          name={props.name}
          className={
            `peer ${wasFocused ? "was-focused" : ""} disabled:text-neutral-500 [&.was-focused]:invalid:outline-error-500 p-3 bg-transparent ` +
            "disabled:bg-neutral-400 w-full h-12 opacity-100 " +
            "outline outline-1 outline-neutral-400 focus:outline-neutral-500 disabled:outline-neutral-500 " +
            "rounded-2xl invalid:text-neutral-400 appearance-none transition-all"
          }
          disabled={props.disabled}
          required={props.required}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
        >
          <option value={""} disabled hidden>
            {props.placeholder}
          </option>
          {props.options.map((option, index) => (
            <option
              key={index}
              className={"text-secondary-500"}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        {props.isLoading ? (
          <i
            className={
              "absolute bottom-1/2 right-3 translate-y-1/2 fill-secondary-500 peer-disabled:fill-neutral-500 " +
              " pointer-events-none transition-all"
            }
          >
            <IconLoader className={"animate-spin"} />
          </i>
        ) : (
          <IconDropdown
            className={
              "absolute bottom-1/2 right-3 translate-y-1/2 fill-secondary-500 peer-disabled:fill-neutral-500 " +
              "peer-focus:rotate-180 pointer-events-none transition-all"
            }
          />
        )}
      </div>
    </Field>
  );
}
