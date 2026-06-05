import {
  data,
  dayLabel,
  fmtDuration,
  fmtMinutes,
  fmtTime,
  localDate,
  minutesOfDay,
  routeById,
  statusById,
  weekDays,
  type Visit,
} from '../data/model';
import { routeEdge, statusBadge, statusEdge } from '../theme-maps';

function AgendaRow({ visit }: { visit: Visit }) {
  const status = statusById[visit.statusId];
  const route = routeById[visit.routeId];
  const endLabel = fmtMinutes(minutesOfDay(visit.start) + visit.durationMinutes);

  return (
    <div className="relative flex items-center gap-3 border-b border-slate-100 py-2 pl-5 pr-4 transition-colors hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-900/40">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${status ? statusEdge[status.color] : 'bg-slate-300'}`}
        aria-hidden
      />
      <div className="num w-24 shrink-0 text-xs font-medium text-slate-600 dark:text-slate-300">
        {fmtTime(visit.start)}–{endLabel}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">{visit.customerName}</div>
        <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">
          {visit.serviceType} · {visit.propertyAddress}
        </div>
      </div>
      {route && (
        <div className="hidden w-40 shrink-0 items-center gap-1.5 md:flex">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${routeEdge[route.color]}`} aria-hidden />
          <span className="truncate text-xs text-slate-600 dark:text-slate-300">{route.name}</span>
        </div>
      )}
      {status && (
        <span
          className={`hidden w-24 shrink-0 rounded-sm px-1.5 py-0.5 text-center font-mono text-[9px] font-bold uppercase tracking-wider sm:inline-block ${statusBadge[status.color]}`}
        >
          {status.label}
        </span>
      )}
      <div className="num w-14 shrink-0 text-right text-[11px] text-slate-400 dark:text-slate-500">
        {fmtDuration(visit.durationMinutes)}
      </div>
    </div>
  );
}

/**
 * Agenda / list view — the week as a dense chronological list, grouped by day.
 * The CSR-and-phone-friendly read: scan times, customers, status, and route
 * without a grid. Left edge bar + badge carry status; the route is a column.
 */
export function AgendaVariant() {
  const days = weekDays(data.weekRange);
  const { todayIso } = data.weekRange;

  return (
    <div className="flex-1 overflow-auto">
      {days.map((day) => {
        const dayVisits = data.visits
          .filter((v) => localDate(v.start) === day)
          .sort((a, b) => minutesOfDay(a.start) - minutesOfDay(b.start));
        const { dow, md } = dayLabel(day);
        const isToday = day === todayIso;

        return (
          <section key={day}>
            <div
              className={`sticky top-0 z-10 flex items-center gap-2 border-y border-slate-200 px-4 py-1.5 dark:border-slate-800 ${
                isToday ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-slate-50 dark:bg-slate-900'
              }`}
            >
              <span className={`text-xs font-semibold uppercase tracking-wider ${isToday ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300'}`}>
                {dow}
              </span>
              <span className="num text-xs text-slate-500 dark:text-slate-400">{md}</span>
              <span className="num rounded-full bg-slate-200 px-1.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {dayVisits.length}
              </span>
            </div>
            {dayVisits.length === 0 ? (
              <div className="border-b border-slate-100 py-3 pl-5 text-[11px] text-slate-400 dark:border-slate-800/60 dark:text-slate-600">
                No visits scheduled
              </div>
            ) : (
              dayVisits.map((v) => <AgendaRow key={v.id} visit={v} />)
            )}
          </section>
        );
      })}
    </div>
  );
}
