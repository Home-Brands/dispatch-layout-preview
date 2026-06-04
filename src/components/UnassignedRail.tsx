import {
  data,
  fmtDuration,
  fmtTime,
  routeById,
  suggestionForUnassigned,
  type UnassignedVisit,
} from '../data/model';
import { routeDot } from '../theme-maps';

const PRIORITY_CHIP: Record<UnassignedVisit['priority'], string> = {
  urgent: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  normal: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  low: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

const SOURCE_LABEL: Record<string, string> = {
  online_booking: 'Online',
  phone: 'Phone',
  sales_handoff: 'Sales',
  referral: 'Referral',
  manual: 'Manual',
};

/**
 * The unassigned queue rail — shared across all three variants so the layouts
 * are compared with the same surrounding context. Cards that have an AI
 * suggestion show the proposed route + time as a dashed hint (the board's
 * "smart scheduling" affordance from the spec).
 */
export function UnassignedRail() {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Unassigned
        </span>
        <span className="num rounded-full bg-slate-200 px-1.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {data.unassignedQueue.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-2.5">
        {data.unassignedQueue.map((item) => {
          const suggestion = suggestionForUnassigned(item.id);
          const suggestedRoute = suggestion ? routeById[suggestion.proposedRouteId] : undefined;
          return (
            <div
              key={item.id}
              className="rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-[11px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
                  {item.customerName}
                </span>
                <span
                  className={`shrink-0 rounded-sm px-1 py-px text-[9px] font-bold uppercase tracking-wider ${PRIORITY_CHIP[item.priority]}`}
                >
                  {item.priority}
                </span>
              </div>
              <div className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-slate-600 dark:text-slate-300">
                {item.serviceType}
              </div>
              <div className="num mt-1 flex items-center gap-2 text-[9px] text-slate-400 dark:text-slate-500">
                <span>{item.requestedWindow}</span>
                <span>·</span>
                <span>{fmtDuration(item.durationMinutes)}</span>
                <span>·</span>
                <span>{SOURCE_LABEL[item.sourceChannel] ?? item.sourceChannel}</span>
              </div>
              {suggestion && suggestedRoute && (
                <div className="mt-1.5 flex items-center gap-1.5 rounded border border-dashed border-indigo-300 bg-indigo-50/60 px-1.5 py-1 dark:border-indigo-500/40 dark:bg-indigo-500/10">
                  <span className={`h-2 w-2 rounded-sm ${routeDot[suggestedRoute.color]}`} aria-hidden />
                  <span className="text-[9px] font-medium text-indigo-700 dark:text-indigo-300">
                    AI: {suggestedRoute.name} · {fmtTime(suggestion.proposedStart)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
