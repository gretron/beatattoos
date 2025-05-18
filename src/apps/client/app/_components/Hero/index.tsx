"use client";

import {
  CSSProperties,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useInView } from "motion/react";
import "./styles.css";
import { LoadingContext } from "../../_contexts/LoadingContext";
import Scene from "./components/Scene";

/**
 * Props for {@link Hero}
 */
interface HeroProps {
  children?: ReactNode;
}

/**
 * Hero section
 */
export default function Hero(props: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isLoaded } = useContext(LoadingContext);

  return (
    <>
      <section
        ref={ref}
        className={"bt-hero"}
        style={{ "--line-count": 2 } as CSSProperties}
      >
        <div
          className={`bt-hero__content ${isLoaded ? "bt-hero__content--is-loaded" : ""}`}
        >
          <Scene />
          <header className={"bt-hero__title"}>
            <div className={"bt-hero__title-line"}>
              <span
                className={"bt-hero__title-span"}
                style={{ "--line-index": 0 } as CSSProperties}
              >
                bea
              </span>
            </div>
            <div className={"bt-hero__title-line"}>
              <span
                className={"bt-hero__title-span"}
                style={{ "--line-index": 1 } as CSSProperties}
              >
                tatt
              </span>
              <span
                className={"bt-hero__title-span"}
                style={{ "--line-index": 1 } as CSSProperties}
              >
                oos
              </span>
            </div>
          </header>
          <p className={"bt-hero__subtitle"}>TATTOO · ARTIST</p>
        </div>
      </section>
    </>
  );
}
