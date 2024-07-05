"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Props for {@link Body}
 */
interface BackgroundColorProps {
  children: ReactNode;
}

/**
 * Application root body with changing background color
 */
export default function Body(props: BackgroundColorProps) {
  const pathname = usePathname();

  return (
    <body
      className={`${pathname.startsWith("/auth") ? "bg-secondary-600" : "bg-primary-500"}`}
    >
      {props.children}
    </body>
  );
}
