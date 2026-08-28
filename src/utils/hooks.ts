// src/utils/hooks.ts (or wherever this lives)
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// Auto-fetches on mount / when dependencies change — used by things like Wines
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      if (isMounted.current) {
        setData(result);
        setLoading(false);
      }
      return result;
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: execute };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Manual trigger — used by things like Login, forms, mutations
export function useAsyncCallback<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      setLoading(false);
      throw e;
    }
  }, []);

  return { data, loading, error, execute };
}

function useSearchQuery<T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean,
  controlled?: { query: string; setQuery: React.Dispatch<React.SetStateAction<string>> }
) {
  const [localQuery, setLocalQuery] = useState('');
  const query = controlled ? controlled.query : localQuery;
  const setQuery = controlled ? controlled.setQuery : setLocalQuery;

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) => filterFn(item, query));
  }, [items, query, filterFn]);

  return { query, setQuery, filteredItems };
}

export default useSearchQuery;