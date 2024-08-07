"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useRef } from "react";
import LandingItems from "~/app/auth/_components/LandingItems";
import Logo, { LogoAnimationDirection } from "~/app/auth/_components/Logo";
import Background from "~/app/auth/_components/Background";
import ErrorBoundary from "~/app/_components/ErrorBoundary";

/**
 * Pages for {@link AuthLayout}
 */
interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Authentication pages layout
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const initialPathname = useRef(pathname);

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
          {children}
        </div>
      </div>
      {/* For CI WebGL-disabled browsers */}
      <ErrorBoundary fallback={null}>
        <Background />
      </ErrorBoundary>
    </section>
  );
}
