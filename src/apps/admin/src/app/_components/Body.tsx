"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface BackgroundColorProps {
  children: ReactNode;
}

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
