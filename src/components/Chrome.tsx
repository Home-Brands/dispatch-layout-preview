import { FEEDBACK_FORM_URL, VARIANTS, type VariantKey } from '../config';
import { data, dayLabel, weekDays } from '../data/model';

function FeedbackButton({ variant }: { variant: VariantKey }) {
  if (FEEDBACK_FORM_URL) {
    const url = new URL(FEEDBACK_FORM_URL);
    url.searchParams.set('variant', variant);
    return (
      <a
        href={url.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 items-center rounded-md bg-indigo-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
      >
        Give feedback
      </a>
    );
  }
  // Unset: show a hint in dev so the builder wires it up; hide in production.
  if (import.meta.env.DEV) {
    return (
      <button
        type="button"
        disabled
        title="Set FEEDBACK_FORM_URL in src/config.ts"
        className="inline-flex h-8 cursor-not-allowed items-center rounded-md border border-dashed border-slate-300 px-3 text-xs font-medium text-slate-400 dark:border-slate-700 dark:text-slate-500"
      >
        Give feedback (set URL)
      </button>
    );
  }
  return null;
}

export function Chrome({
  variant,
  onVariant,
}: {
  variant: VariantKey;
  onVariant: (v: VariantKey) => void;
}) {
  const days = weekDays(data.weekRange);
  const start = dayLabel(days[0]!);
  const end = dayLabel(days[6]!);
  const weekLabel = `${start.md} – ${end.md}, ${data.weekRange.start.slice(0, 4)}`;
  const scope = data.currentScope;

  return (
    <header className="z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-baseline gap-3">
          <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Dispatch</h1>
          {scope && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {[scope.brand, scope.location].filter(Boolean).join(' · ')}
            </span>
          )}
          <span className="num text-xs text-slate-400 dark:text-slate-500">{weekLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <FeedbackButton variant={variant} />
        </div>
      </div>

      {/* Variant tabs */}
      <div className="flex items-center gap-1 px-4">
        {VARIANTS.map((v) => {
          const active = v.key === variant;
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => onVariant(v.key)}
              title={v.blurb}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-indigo-600 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
