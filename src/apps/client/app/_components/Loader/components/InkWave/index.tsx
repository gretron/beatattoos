"use client";

import { ReactNode } from "react";
import "./styles.css";

/**
 * Props for {@link InkWave}
 */
interface InkWaveProps {
  children?: ReactNode;
}

/**
 * Ink wave
 */
export default function InkWave(props: InkWaveProps) {
  return (
    <svg
      className={"bt-ink-wave"}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 300 72"
    >
      <defs>
        <clipPath id="clip-path">
          <rect width="300" height="72" />
        </clipPath>
      </defs>
      <g clipPath={"url(#clip-path)"}>
        <path
          className={"bt-ink-wave__wave"}
          fill={"none"}
          d="m-191,4c19.12,0,19.12,64,38.23,64S-133.65,4-114.53,4s19.12,64,38.23,64S-57.19,4-38.07,4-18.95,68,.16,68,19.28,4,38.4,4s19.12,64,38.23,64S95.75,4,114.87,4s19.12,64,38.24,64S172.22,4,191.34,4s19.12,64,38.23,64S248.69,4,267.8,4s19.12,64,38.24,64S325.16,4,344.28,4s19.12,64,38.24,64S401.64,4,420.76,4s19.12,64,38.24,64"
        />
      </g>
    </svg>
  );
}
