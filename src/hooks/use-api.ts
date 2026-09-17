"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ApiError } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Minimal data-fetching hook. No SWR/react-query dependency.
 * Returns { data, loading, error, refetch }.
 *
 * Pass a `deps` array to control when the fetcher re-runs (e.g. when a query
 * parameter changes). When omitted, the fetcher runs once on mount.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (e: unknown) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Request failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-run when any dep changes
  useEffect(() => {
    run();
     
  }, [run, ...deps]);

  return { data, loading, error, refetch: run };
}


