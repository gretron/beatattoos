"use client";

import { ReactNode, useContext, useEffect } from "react";
import { LoadingContext } from "../../_contexts/LoadingContext";

/**
 * Props for {@link HomePageFallback}
 */
interface HomePageFallbackProps {
  children?: ReactNode;
}

/**
 * Suspense fallback for home page
 */
export default function HomePageFallback(props: HomePageFallbackProps) {
  const { setIsLoaded } = useContext(LoadingContext);

  useEffect(() => {
    return () => {
      /* When fallback disappears, loading is completed */
      setIsLoaded(true);
    };
  }, []);

  return <></>;
}
