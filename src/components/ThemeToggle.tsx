import { useEffect, useState } from 'react';

/**
 * Light/dark toggle. Replicates next-themes' class strategy (.dark on <html>)
 * without the dependency — the inline script in index.html sets the initial
 * class before paint; this just flips and persists it.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span aria-hidden>{dark ? '☀' : '☾'}</span>
      <span>{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
