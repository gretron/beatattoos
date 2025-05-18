"use client";

import { ReactNode } from "react";
import "./styles.css";

/**
 * Props for {@link Styles}
 */
interface StylesProps {
  children?: ReactNode;
}

/**
 * Styles section
 */
export default function Styles(props: StylesProps) {
  return (
    <>
      <section className={"bt-styles"}></section>
    </>
  );
}
