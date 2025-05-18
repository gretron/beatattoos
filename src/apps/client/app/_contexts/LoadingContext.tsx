"use client";

import { createContext, ReactNode, useState } from "react";

/**
 * Props for {@link LoadingContext}
 */
interface LoadingContextProviderProps {
  children?: ReactNode;
}

/**
 * State for {@link LoadingContext}
 */
interface LoadingContextState {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
}

/**
 * Loading context
 */
export const LoadingContext = createContext<LoadingContextState>({
  isLoaded: false,
  setIsLoaded: () => {},
});

/**
 * Provider for {@link LoadingContext}
 */
export default function LoadingContextProvider(
  props: LoadingContextProviderProps,
) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <LoadingContext.Provider value={{ isLoaded, setIsLoaded }}>
        {props.children}
      </LoadingContext.Provider>
    </>
  );
}
