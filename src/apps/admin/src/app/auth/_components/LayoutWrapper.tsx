"use client";

import { ReactNode, useRef } from "react";
import Logo, { LogoAnimationDirection } from "~/app/auth/_components/Logo";
import LandingItems from "~/app/auth/_components/LandingItems";
import ErrorBoundary from "~/app/_components/ErrorBoundary";
import Background from "~/app/auth/_components/Background";
import { usePathname } from "next/navigation";

/**
 * Props for {@link LayoutWrapper}
 */
interface LayoutWrapperProps {
  children?: ReactNode;
}

/**
 * Wrapper for auth layout
 */
export default function LayoutWrapper(props: LayoutWrapperProps) {
  const pathname = usePathname();
  const initialPathname = useRef(pathname);
  const isContinualIntegration = !!process.env.NEXT_PUBLIC_CI;

  return (
    <section
      id={"container"}
      className={
        "grid h-full min-h-dvh md:p-10 " +
        `${pathname === "/auth" ? "max-md:grid-rows-[213px_1fr_0fr] md:grid-cols-[minmax(0,_1fr)_0fr]" : "max-md:grid-rows-[213px_0fr_1fr] md:grid-cols-[minmax(0,_1fr)_1fr]"} ` + // Page reveal transition
        "ease-[cubic-bezier(0.83, 0, 0.17, 1)] transition-[grid-template-rows] !duration-700 md:transition-[grid-template-columns]"
      }
    >
      <div className={"z-10 flex flex-col items-center justify-center"}>
        <div
          className={
            "sticky top-6 mb-4 w-full max-md:pl-6 md:top-10 md:flex-grow"
          }
        >
          <Logo
            className={`text-2xl`}
            isVisible={pathname !== "/auth"}
            animationDirection={LogoAnimationDirection.Up}
          />
        </div>
        <div
          className={
            "text-center max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:translate-x-[-50%] max-md:translate-y-[-50%]"
          }
        >
          <Logo
            className={"h-[72px] w-max text-7xl md:h-32 md:text-9xl"}
            isVisible={pathname === "/auth"}
            animationDirection={LogoAnimationDirection.Down}
          />
          <LandingItems
            className={`${initialPathname.current === "/auth" ? "" : "opacity-0"}`}
            isVisible={pathname === "/auth"}
          />
        </div>
        <div className={"flex-grow"}></div>
      </div>
      <div
        className={
          "z-10 flex justify-center overflow-hidden max-md:row-start-3 max-md:row-end-4"
        }
      >
        <div
          className={`h-full max-w-4xl grow overflow-hidden rounded-t-4xl bg-primary-500 duration-500 md:rounded-4xl`}
        >
          {props.children}
        </div>
      </div>
      {/* For CI WebGL-disabled browsers */}
      {!isContinualIntegration && (
        <ErrorBoundary fallback={null}>
          <Background />
        </ErrorBoundary>
      )}
    </section>
  );
}
