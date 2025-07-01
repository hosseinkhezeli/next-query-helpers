'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type QueryValue = string | number | boolean;
type QueryParams = Record<string, QueryValue | QueryValue[] | undefined>;

interface QueryOptions {
  scroll?: boolean;
  merge?: boolean;
}

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const localSearchParams = useSearchParams();

  const toUrlSearchParams = (
    query: QueryParams,
    baseParams?: URLSearchParams
  ): URLSearchParams => {
    const params = new URLSearchParams(baseParams?.toString() || '');

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    });

    return params;
  };

  const addQueryParams = (
    query: QueryParams,
    options: QueryOptions = {}
  ) => {
    const currentParams = localSearchParams;
    const mergedParams = options.merge
      ? toUrlSearchParams(query, currentParams)
      : toUrlSearchParams(query);

    const queryString = mergedParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {
      scroll: options.scroll ?? false,
    });
  };

  const removeQueryParams = (
    keys: string | string[],
    options: QueryOptions = {}
  ) => {
    const currentParams = new URLSearchParams(localSearchParams.toString());

    (Array.isArray(keys) ? keys : [keys]).forEach((key) =>
      currentParams.delete(key)
    );

    const queryString = currentParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {
      scroll: options.scroll ?? false,
    });
  };

  const resetQueryParams = (options: QueryOptions = {}) => {
    router.push(pathname, {
      scroll: options.scroll ?? false,
    });
  };

  const getQueryParam = <T = string>(
    key: string,
    fallback?: T
  ): T | string | null => {
    if (typeof window === 'undefined') return fallback ?? null;
    return localSearchParams.get(key) ?? fallback ?? null;
  };

  return {
    addQueryParams,
    removeQueryParams,
    resetQueryParams,
    getQueryParam,
  };
}
