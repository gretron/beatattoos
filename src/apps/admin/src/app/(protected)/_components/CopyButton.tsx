"use client";

import { ReactNode, useEffect, useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import { AnimatedIconCheck, useCopy } from "@beatattoos/ui";

/**
 * Props for {@link CopyButton}
 */
interface CopyButtonProps {
  value: string;
  isPending?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  children?: ReactNode;
}

/**
 * Button to copy value to clipboard
 */
export default function CopyButton(props: CopyButtonProps) {
  const { isCopied, handleCopyClick } = useCopy(props.value);

  return (
    <button
      type={"button"}
      className={`btn-neutral z-10 ${props.className}`}
      disabled={props.isPending}
      onClick={handleCopyClick}
    >
      {isCopied ? (
        <>
          <AnimatedIconCheck className={`h-5 w-5 ${props.iconClassName}`} />
          {props.showText !== false && (
            <span className={`max-lg:hidden ${props.textClassName}`}>
              Copied
            </span>
          )}
        </>
      ) : (
        <>
          <IconCopy className={`h-5 w-5 ${props.iconClassName}`} />
          {props.showText !== false && (
            <span className={`max-lg:hidden ${props.textClassName}`}>Copy</span>
          )}
        </>
      )}
    </button>
  );
}
