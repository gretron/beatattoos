"use client";

import { CSSProperties, ReactNode, useContext } from "react";
import InkWave from "./components/InkWave";
import TattooGun from "./components/TattooGun";
import { LoadingContext } from "../../_contexts/LoadingContext";
import TransitionHand from "../TransitionHand";
import "./styles.css";

/**
 * Props for {@link Loader}
 */
interface LoaderProps {
  children?: ReactNode;
}

/**
 * Initial-load loader
 */
export default function Loader(props: LoaderProps) {
  const { isLoaded } = useContext(LoadingContext);

  return (
    <>
      <div
        className={`bt-loader ${isLoaded ? "bt-loader--is-loaded" : ""}`}
        style={{ "--loader-quote-span-count": 2 } as CSSProperties}
      >
        <div className={"bt-loader__container"}>
          <div className={"bt-loader__loader"}>
            <InkWave />
            <TattooGun />
          </div>
          <p className={"bt-loader__quote"}>
            <span
              className={"bt-loader__quote-span bt-loader__quote-span--top"}
              style={{ "--span-index": 0 } as CSSProperties}
            >
              bea
            </span>
            <span
              className={"bt-loader__quote-span bt-loader__quote-span--bottom"}
              style={{ "--span-index": 1 } as CSSProperties}
            >
              tattoos
            </span>
          </p>
        </div>
        <TransitionHand />
      </div>
    </>
  );
}
