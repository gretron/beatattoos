"use client";

import { ReactNode } from "react";
import "../styles/globals.css";
import { ZodType } from "zod";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { IconCircleXFilled } from "@tabler/icons-react";

export interface RequiredFieldProps {
  id: string;
  className?: string;
  inputContainerClassName?: string;
  inputWrapperClassName?: string;
  heading?: string;
  subheading?: string;
  name?: string;
  required?: boolean;
  schema?: ZodType;
  fieldPrependNode?: ReactNode;
  fieldAppendNode?: ReactNode;
}

interface FieldProps extends RequiredFieldProps {
  children?: ReactNode;
  errorMessage?: ReactNode;
}

export default function Field(props: FieldProps) {
  const messageVariants: Variants = {
    hidden: {
      marginTop: 0,
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    show: {
      marginTop: 8,
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className={`${props.className}`}>
      {props.heading && (
        <label
          htmlFor={props.id}
          className={"flex gap-1 justify-between items-center mb-1"}
        >
          <h5>{props.heading}</h5>
          {props.required !== undefined && !props.required && (
            <div className={"text-neutral-400 text-sm"}>Optional</div>
          )}
        </label>
      )}
      {props.subheading && (
        <div className={"text-neutral-500 text-sm font-bold"}>
          {props.subheading}
        </div>
      )}
      <div
        className={`flex max-md:grid grow gap-2 ${props.inputWrapperClassName}`}
      >
        {props.fieldPrependNode}
        <div
          className={`grow max-md:row-start-1 ${props.inputContainerClassName}`}
        >
          {props.children}
          <AnimatePresence>
            {props.errorMessage && (
              <motion.div
                initial={"hidden"}
                animate={"show"}
                exit={"hidden"}
                variants={messageVariants}
                className={"flex gap-1 overflow-hidden text-error-500"}
              >
                <IconCircleXFilled stroke={2} className={"fill-error-500"} />
                {props.errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {props.fieldAppendNode}
      </div>
    </div>
  );
}
