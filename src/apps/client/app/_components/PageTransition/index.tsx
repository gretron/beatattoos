"use client";

import { ReactNode, useRef } from "react";
import TransitionHand from "../TransitionHand";
import "./styles.css";
import { useInView } from "motion/react";

/**
 * Props for {@link PageTransition}
 */
interface PageTransitionProps {
  children?: ReactNode;
}

/**
 * Page transition
 */
export default function PageTransition(props: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
      <div
        ref={ref}
        className={`bt-page-transition ${isInView ? "bt-page-transition--in-view" : ""}`}
      >
        <div className={"bt-page-transition__background"}></div>
        <TransitionHand />
      </div>
    </>
  );
}
