import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Tiny query-string state. State (selected variant, selected day) lives in the
 * URL so any view is a shareable deep link — a reviewer can paste back exactly
 * what they were looking at. Pure client-side; works on a static Pages host
 * because there's only ever one document (index.html) and no path routing.
 */
export function useUrl() {
  const [search, setSearch] = useState(() => window.location.search);

  useEffect(() => {
    const onPop = () => setSearch(window.location.search);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const update = useCallback((next: Record<string, string | null>) => {
    const p = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(next)) {
      if (value === null) p.delete(key);
      else p.set(key, value);
    }
    const qs = p.toString();
    window.history.pushState(null, '', qs ? `?${qs}` : window.location.pathname);
    setSearch(window.location.search);
  }, []);

  return { params, update };
}
