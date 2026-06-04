import { fmtDuration, fmtTime, statusById, type Visit } from '../data/model';
import { statusBadge, statusEdge } from '../theme-maps';

/**
 * Presentational visit card — the swimlane cell tile. Visual parity with the
 * app's components/dispatch/VisitTile.tsx (status edge bar + time + customer +
 * service + status pill), minus all the wired behavior (drag, status popover,
 * multi-select). This is a mockup: it shows, it doesn't do.
 */
export function VisitTile({ visit }: { visit: Visit }) {
  const status = statusById[visit.statusId];
  const isUrgent = false; // sample visits don't carry priority; tiles stay calm

  return (
    <div className="relative w-full overflow-hidden rounded-md border border-slate-200 bg-white text-left dark:border-slate-700 dark:bg-slate-900">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${status ? statusEdge[status.color] : 'bg-slate-300'}`}
        aria-hidden
      />
      <div className="py-1.5 pl-2 pr-1.5">
        <div className="flex items-baseline gap-1.5">
          <span className="num text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            {fmtTime(visit.start)}
          </span>
          <span className="num text-[9px] text-slate-400 dark:text-slate-500">
            {fmtDuration(visit.durationMinutes)}
          </span>
          {isUrgent && <span className="ml-auto text-[9px] font-bold text-rose-600">!</span>}
        </div>
        <div className="mt-0.5 line-clamp-2 break-words text-[11px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
          {visit.customerName}
        </div>
        <div className="mt-0.5 line-clamp-2 break-words text-[10px] leading-tight text-slate-600 dark:text-slate-300">
          {visit.serviceType}
        </div>
        {status && (
          <div className="mt-1">
            <span
              className={`inline-flex items-center rounded-sm px-1 py-px font-mono text-[9px] font-bold uppercase tracking-wider ${statusBadge[status.color]}`}
            >
              {status.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
