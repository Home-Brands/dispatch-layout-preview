import { Check, Sparkles, X } from 'lucide-react';
import {
  dayLabel,
  fmtTime,
  localDate,
  type AiSuggestion,
  type Route,
  type UnassignedVisit,
} from '../data/model';

/** 'Tue 1:30p' — timezone-safe (uses the offset carried in the ISO string). */
function suggestionTime(iso: string): string {
  return `${dayLabel(localDate(iso)).dow} ${fmtTime(iso)}`;
}

/**
 * Ported from product-plan/sections/dispatch-board/components/AiSuggestionCard.tsx.
 * Dashed emerald card that replaces a queue item when AI has a placement.
 * Accept/Dismiss are visual only here (this is a mockup).
 */
export function AiSuggestionCard({
  suggestion,
  visit,
  route,
}: {
  suggestion: AiSuggestion;
  visit?: UnassignedVisit;
  route?: Route;
}) {
  const confidencePct = Math.round(suggestion.confidence * 100);

  return (
    <div className="relative rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-2.5 dark:border-emerald-500/40 dark:bg-emerald-500/5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          <Sparkles className="h-3 w-3" />
          AI suggests
        </div>
        <span className="font-mono text-[10px] font-semibold tabular-nums text-emerald-700/80 dark:text-emerald-300/80">
          {confidencePct}%
        </span>
      </div>

      {visit && (
        <div className="mb-1 truncate text-[13px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
          {visit.customerName}
        </div>
      )}
      {visit && (
        <div className="mb-1.5 truncate text-[11px] leading-tight text-slate-600 dark:text-slate-400">
          {visit.serviceType}
        </div>
      )}

      <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
        <span className="text-slate-400 dark:text-slate-500">→</span>
        <span className="truncate">{route?.name ?? 'route'}</span>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <span className="font-mono tabular-nums">{suggestionTime(suggestion.proposedStart)}</span>
      </div>

      <p className="mb-2.5 text-[11px] leading-snug text-slate-600 dark:text-slate-400">{suggestion.rationale}</p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Check className="h-3 w-3" />
          Accept
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          className="inline-flex items-center justify-center rounded-md border border-slate-200 px-2 py-1 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
