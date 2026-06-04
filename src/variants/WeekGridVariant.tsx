import { RouteLegend } from '../components/RouteLegend';
import {
  data,
  dayLabel,
  fmtTime,
  localDate,
  routeById,
  statusById,
  weekDays,
} from '../data/model';
import { routeSoft, statusDot } from '../theme-maps';
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

const COL_TEMPLATE = '56px repeat(7, minmax(150px, 1fr))';

/**
 * Week time-grid — a familiar calendar week. Day columns × time rows, every
 * visit a positioned block sized by duration and colored by its ROUTE (so
 * route reads as color rather than as a dedicated lane). Overlapping visits in
 * a day pack side-by-side, calendar-app style.
 */
export function WeekGridVariant() {
  const days = weekDays(data.weekRange);
  const { todayIso } = data.weekRange;

  return (
    <div className="flex-1 overflow-auto">
      <div className="border-b border-slate-200 px-4 py-2 dark:border-slate-800">
        <RouteLegend />
      </div>

      <div className="grid min-w-[1100px]" style={{ gridTemplateColumns: COL_TEMPLATE }}>
        {/* Header row */}
        <div className="sticky top-0 z-20 border-b-2 border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900" />
        {days.map((day) => {
          const { dow, md } = dayLabel(day);
          const isToday = day === todayIso;
          return (
            <div
              key={day}
              className={`sticky top-0 z-10 border-b-2 border-r border-slate-200 px-2 py-2 text-center dark:border-slate-700 ${
                isToday ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-slate-50 dark:bg-slate-900'
              }`}
            >
              <div className={`text-[10px] font-semibold uppercase tracking-wider ${isToday ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>
                {dow}
              </div>
              <div className={`num text-xs font-semibold ${isToday ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                {md}
              </div>
            </div>
          );
        })}

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

        {/* Day columns */}
        {days.map((day) => {
          const isToday = day === todayIso;
          const placed = packLanes(data.visits.filter((v) => localDate(v.start) === day));
          return (
            <div
              key={day}
              className={`relative border-r border-slate-200 dark:border-slate-800 ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-500/[0.03]' : ''}`}
              style={{ height: GRID_HEIGHT }}
            >
              {/* hour lines */}
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-t border-slate-100 dark:border-slate-800/60"
                  style={{ top: i * PX_PER_HOUR }}
                />
              ))}
              {/* events */}
              {placed.map(({ visit, lane, laneCount }) => {
                const route = routeById[visit.routeId];
                const status = statusById[visit.statusId];
                if (!route) return null;
                return (
                  <div
                    key={visit.id}
                    title={`${visit.customerName} — ${visit.serviceType} (${route.name})`}
                    className={`absolute overflow-hidden rounded-md border px-1.5 py-1 ${routeSoft[route.color]}`}
                    style={{
                      top: topPx(visit),
                      height: heightPx(visit),
                      left: `calc(${(lane * 100) / laneCount}% + 2px)`,
                      width: `calc(${100 / laneCount}% - 4px)`,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {status && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[status.color]}`} aria-hidden />}
                      <span className="num text-[9px] font-semibold opacity-80">{fmtTime(visit.start)}</span>
                    </div>
                    <div className="line-clamp-1 text-[10px] font-semibold leading-tight">{visit.customerName}</div>
                    <div className="line-clamp-1 text-[9px] leading-tight opacity-75">{visit.serviceType}</div>
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
