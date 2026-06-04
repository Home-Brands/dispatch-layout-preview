import {
  data,
  dayLabel,
  fmtTime,
  localDate,
  statusById,
  weekDays,
} from '../data/model';
import { statusDot, statusSoft } from '../theme-maps';
import { routeEdge } from '../theme-maps';
import {
  GRID_HEIGHT,
  HOURS,
  heightPx,
  hourLabel,
  packLanes,
  PX_PER_HOUR,
  topPx,
  DAY_START_MIN,
  PX_PER_MIN,
} from './grid-shared';

/**
 * Resource day-grid — a single day, one column per route (the "resource"),
 * time down the side. Dense operational view for working a single day; here
 * color encodes STATUS (route is already the column), the inverse of the week
 * grid — a deliberate contrast for reviewers to react to.
 */
export function ResourceDayGridVariant({
  day,
  onDayChange,
}: {
  day: string;
  onDayChange: (day: string) => void;
}) {
  const days = weekDays(data.weekRange);
  const colTemplate = `56px repeat(${data.routes.length}, minmax(176px, 1fr))`;

  return (
    <div className="flex-1 overflow-auto">
      {/* Day picker + status legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
        <div className="flex items-center gap-1">
          {days.map((d) => {
            const { dow, md } = dayLabel(d);
            const active = d === day;
            return (
              <button
                key={d}
                type="button"
                onClick={() => onDayChange(d)}
                className={`flex flex-col items-center rounded-md px-2.5 py-1 text-center transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-[9px] font-semibold uppercase tracking-wider">{dow}</span>
                <span className="num text-xs font-semibold">{md.replace(/^\w+ /, '')}</span>
              </button>
            );
          })}
        </div>
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
      </div>

      <div className="grid min-w-[1200px]" style={{ gridTemplateColumns: colTemplate }}>
        {/* Header row: corner + route columns */}
        <div className="sticky top-0 z-20 border-b-2 border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900" />
        {data.routes.map((route) => (
          <div
            key={route.id}
            className="sticky top-0 z-10 border-b-2 border-r border-slate-200 bg-slate-50 px-2 py-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center gap-1.5">
              <span className={`h-3 w-1.5 rounded-full ${routeEdge[route.color]}`} aria-hidden />
              <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-50">{route.name}</span>
            </div>
            <div className="num mt-0.5 text-[9px] text-slate-400 dark:text-slate-500">
              {route.members.map((m) => m.avatarInitials).join(' · ')}
            </div>
          </div>
        ))}

        {/* Time gutter */}
        <div className="relative border-r border-slate-200 dark:border-slate-800" style={{ height: GRID_HEIGHT }}>
          {HOURS.map((h) => (
            <div
              key={h}
              className="num absolute right-1 -translate-y-1/2 text-[9px] text-slate-400 dark:text-slate-500"
              style={{ top: (h * 60 - DAY_START_MIN) * PX_PER_MIN }}
            >
              {hourLabel(h)}
            </div>
          ))}
        </div>

        {/* Route columns for the selected day */}
        {data.routes.map((route) => {
          const placed = packLanes(
            data.visits.filter((v) => v.routeId === route.id && localDate(v.start) === day),
          );
          return (
            <div
              key={route.id}
              className="relative border-r border-slate-200 dark:border-slate-800"
              style={{ height: GRID_HEIGHT }}
            >
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-t border-slate-100 dark:border-slate-800/60"
                  style={{ top: i * PX_PER_HOUR }}
                />
              ))}
              {placed.length === 0 && (
                <div className="absolute inset-0 flex items-start justify-center pt-6 text-[10px] text-slate-300 dark:text-slate-700">
                  No visits
                </div>
              )}
              {placed.map(({ visit, lane, laneCount }) => {
                const status = statusById[visit.statusId];
                return (
                  <div
                    key={visit.id}
                    title={`${visit.customerName} — ${visit.serviceType}`}
                    className={`absolute overflow-hidden rounded-md border px-1.5 py-1 ${status ? statusSoft[status.color] : 'border-slate-300 bg-white'}`}
                    style={{
                      top: topPx(visit),
                      height: heightPx(visit),
                      left: `calc(${(lane * 100) / laneCount}% + 2px)`,
                      width: `calc(${100 / laneCount}% - 4px)`,
                    }}
                  >
                    <div className="num text-[9px] font-semibold opacity-80">{fmtTime(visit.start)}</div>
                    <div className="line-clamp-1 text-[10px] font-semibold leading-tight">{visit.customerName}</div>
                    <div className="line-clamp-2 text-[9px] leading-tight opacity-75">{visit.serviceType}</div>
                    {status && (
                      <div className="num mt-0.5 text-[8px] font-bold uppercase tracking-wider opacity-70">
                        {status.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
