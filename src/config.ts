// ── CONFIGURE ME ────────────────────────────────────────────────────────────
// Paste your Google Form / Typeform / survey URL here. The "Give feedback"
// button opens it in a new tab with `?variant=<current>` appended, so you can
// see which layout a respondent was looking at.
//
// Leave it empty to ship without a feedback link (the button hides itself).
export const FEEDBACK_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfIN0zzwa5BgW9sIPEhcYaA287HjBdbGJaZC71NUQu801Ac9A/viewform';
// ─────────────────────────────────────────────────────────────────────────────

export const VARIANTS = [
  { key: 'swimlane', label: 'Route (no hour grid)', blurb: 'Current design — a lane per route, visits stacked (no time axis)' },
  { key: 'week', label: 'Week by Route (with hour grid)', blurb: 'Per-route week, each route an hourly timeline, stacked' },
  { key: 'resource', label: 'Day grid', blurb: 'One day, a column per route' },
  { key: 'gantt', label: 'Gantt board', blurb: 'One day, routes as rows, time runs left→right' },
  { key: 'agenda', label: 'Agenda', blurb: 'The week as a chronological list, grouped by day' },
] as const;

export type VariantKey = (typeof VARIANTS)[number]['key'];

export const DEFAULT_VARIANT: VariantKey = 'swimlane';

export function isVariant(value: string | null): value is VariantKey {
  return VARIANTS.some((v) => v.key === value);
}
