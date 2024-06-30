"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import "./styles/globals.css";
import { ZodType } from "zod";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { IconCircleXFilled } from "@tabler/icons-react";

export interface RequiredFieldProps {
  id: string;
  className?: string;
  heading: string;
  subheading?: string;
  name?: string;
  required?: boolean;
  schema?: ZodType;
}

interface FieldProps extends RequiredFieldProps {
  children?: ReactNode;
  errorMessage?: ReactNode;
}

export default function Field(props: FieldProps) {
  const messageVariants: Variants = {
    hidden: {
      gridTemplateRows: "0fr",
      marginTop: 0,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    show: {
      gridTemplateRows: "1fr",
      marginTop: 8,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className={`${props.className} mb-4`}>
      <label
        htmlFor={props.id}
        className={"flex gap-1 justify-between items-center mb-1"}
      >
        <h5>{props.heading}</h5>
        {!props.required && (
          <div className={"text-neutral-400 text-sm"}>Optional</div>
        )}
      </label>
      {props.subheading && (
        <div className={"text-neutral-500 text-sm font-bold"}>
          {props.subheading}
        </div>
      )}
      {props.children}
      <AnimatePresence>
        {props.errorMessage && (
          <motion.div
            className={"grid"}
            initial={"hidden"}
            animate={"show"}
            exit={"hidden"}
            variants={messageVariants}
          >
            <motion.div
              layout
              className={"flex gap-1 overflow-hidden text-error-500"}
            >
              <IconCircleXFilled stroke={2} className={"fill-error-500"} />
              {props.errorMessage}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
