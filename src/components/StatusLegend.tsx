import { data } from '../data/model';
import { statusDot } from '../theme-maps';

/** Maps each status color to its label — shown where color encodes status. */
export function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Status
      </span>
      {data.statuses.map((s) => (
        <span key={s.id} className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <span className={`h-2 w-2 rounded-sm ${statusDot[s.color]}`} aria-hidden />
          {s.label}
        </span>
      ))}
    </div>
  );
}
