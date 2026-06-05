import type { RouteColor, StatusColor } from './data/model';

// Full literal class strings — Tailwind v4 only generates utilities it finds
// verbatim in source, so these must NOT be built dynamically (`bg-${c}-500`).
// statusEdge / statusBadge / routeEdge are copied from the app's
// components/dispatch/dispatch-helpers.ts so the mockups match production.

/** Left status edge bar on a visit tile. */
export const statusEdge: Record<StatusColor, string> = {
  slate: 'bg-slate-400',
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
};

/** Small status pill on a visit tile. */
export const statusBadge: Record<StatusColor, string> = {
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  sky: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
};

/** Solid dot — status legend / status-colored markers. */
export const statusDot: Record<StatusColor, string> = statusEdge;

/** Route color edge bar / solid swatch. */
export const routeEdge: Record<RouteColor, string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  teal: 'bg-teal-500',
};
