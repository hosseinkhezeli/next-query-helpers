'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

type QueryValue = string | number | boolean;
type QueryParams = Record<string, QueryValue | QueryValue[] | undefined>;

interface QueryOptions {
  scroll?: boolean;
  merge?: boolean;
}

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Convert a query object to URLSearchParams, optionally merging with current params
  const toUrlSearchParams = useCallback(
    (query: QueryParams, base?: URLSearchParams) => {
      const params = new URLSearchParams(base?.toString() || '');
      for (const [key, value] of Object.entries(query)) {
        if (value == null) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.set(key, String(value));
        }
      }
      return params;
    },
    []
  );

  const addQueryParams = useCallback(
    (query: QueryParams, options: QueryOptions = { merge: true }) => {
      const base = options.merge ? new URLSearchParams(searchParams.toString()) : undefined;
      const params = toUrlSearchParams(query, base);
      router.push(`${pathname}${params.toString() ? `?${params}` : ''}`, {
        scroll: options.scroll ?? false,
      });
    },
    [router, pathname, searchParams, toUrlSearchParams]
  );

  const removeQueryParams = useCallback(
    (keys: string | string[], options: QueryOptions = { scroll: false }) => {
      const params = new URLSearchParams(searchParams.toString());
      const keysToRemove = Array.isArray(keys) ? keys : [keys];
      keysToRemove.forEach((key) => params.delete(key));
      router.push(`${pathname}${params.toString() ? `?${params}` : ''}`, {
        scroll: options.scroll,
      });
    },
    [router, pathname, searchParams]
  );

  const resetQueryParams = useCallback(
    (options: QueryOptions = { scroll: false }) => {
      router.push(pathname, {
        scroll: options.scroll,
      });
    },
    [router, pathname]
  );

  const getQueryParam = useCallback(
    <T = string>(key: string, fallback?: T): T | string | null => {
      if (typeof window === 'undefined') return fallback ?? null;
      return searchParams.get(key) ?? fallback ?? null;
    },
    [searchParams]
  );

  return useMemo(
    () => ({
      addQueryParams,
      removeQueryParams,
      resetQueryParams,
      getQueryParam,
    }),
    [addQueryParams, removeQueryParams, resetQueryParams, getQueryParam]
  );
}
