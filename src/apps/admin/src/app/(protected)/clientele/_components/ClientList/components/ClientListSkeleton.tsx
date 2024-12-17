"use client";

import { ReactNode } from "react";

/**
 * Props for {@link ClientListSkeleton}
 */
interface ClientListSkeletonProps {
  children?: ReactNode;
}

/**
 * Skeleton placeholder for {@link ClientList}
 */
export default function ClientListSkeleton(props: ClientListSkeletonProps) {
  return (
    <div
      className={
        "flex animate-pulse flex-col gap-3 rounded-2xl border border-neutral-400 p-4"
      }
    >
      {Array.from(Array(3).keys()).map((item, index) => (
        <div key={index} className={"flex h-5 items-center gap-2"}>
          <div className={"h-4 w-4 rounded-full bg-neutral-400"}></div>
          <div
            className={`h-4 ${["w-3/6", "w-5/6", "w-4/6"][index]} rounded-full bg-neutral-400`}
          ></div>
        </div>
      ))}
    </div>
  );
}
