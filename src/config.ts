// ── CONFIGURE ME ────────────────────────────────────────────────────────────
// Paste your Google Form / Typeform / survey URL here. The "Give feedback"
// button opens it in a new tab with `?variant=<current>` appended, so you can
// see which layout a respondent was looking at.
//
// Leave it empty to ship without a feedback link (the button hides itself).
export const FEEDBACK_FORM_URL = '';
// ─────────────────────────────────────────────────────────────────────────────

export const VARIANTS = [
  { key: 'swimlane', label: 'Route swimlanes', blurb: 'Current design — a lane per route' },
  { key: 'week', label: 'Week grid', blurb: 'Calendar week, colored by route' },
  { key: 'resource', label: 'Day grid', blurb: 'One day, a column per route' },
] as const;

export type VariantKey = (typeof VARIANTS)[number]['key'];

export const DEFAULT_VARIANT: VariantKey = 'swimlane';

export function isVariant(value: string | null): value is VariantKey {
  return VARIANTS.some((v) => v.key === value);
}
