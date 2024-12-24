"use client";

import { useEffect, useState } from "react";

/**
 * Hook for infinite scroll fetching
 */
export default function useInfiniteScroll<T>(
  fetchData: () => Promise<T[]>,
  targetRef?: HTMLElement | null,
) {
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);

          const result = await fetchData();

          if (result.length < 1) {
            setHasMore(false);
          }

          setIsLoading(false);
        }
      },
      { threshold: 1 },
    );

    if (targetRef) {
      observer.observe(targetRef);
    }

    return () => {
      if (targetRef) {
        observer.unobserve(targetRef);
      }
    };
  }, [targetRef, hasMore, isLoading, fetchData]);

  return { hasMore, isLoading };
}
