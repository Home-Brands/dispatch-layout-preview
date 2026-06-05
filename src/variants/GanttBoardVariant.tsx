import { DayPicker } from '../components/DayPicker';
import { GridVisitBlock } from '../components/GridVisitBlock';
import { StatusLegend } from '../components/StatusLegend';
import { data, hourLabel, localDate, minutesOfDay, weekDays } from '../data/model';
import { routeEdge } from '../theme-maps';

const LABEL_W = 176;
const ROW_H = 64;
const PX_PER_HOUR = 88;
const PX_PER_MIN = PX_PER_HOUR / 60;

// Time window fit to the day's data range across all routes (whole hours).
const allStarts = data.visits.map((v) => minutesOfDay(v.start));
const allEnds = data.visits.map((v) => minutesOfDay(v.start) + v.durationMinutes);
const START_MIN = Math.floor(Math.min(...allStarts) / 60) * 60;
const END_MIN = Math.ceil(Math.max(...allEnds) / 60) * 60;
const TRACK_W = ((END_MIN - START_MIN) / 60) * PX_PER_HOUR;
const HOURS = Array.from({ length: (END_MIN - START_MIN) / 60 + 1 }, (_, i) => START_MIN / 60 + i);

/**
 * Horizontal dispatch board (Gantt-style) — the FSM-standard view. Resources
 * (routes) are rows; time runs left→right; each visit is a horizontal bar
 * positioned by start time and sized by duration. Single day, colored by
 * status. Reads like an operations/transit board — easy to scan gaps and the
 * whole crew's day at once.
 */
export function GanttBoardVariant({
  day,
  onDayChange,
}: {
  day: string;
  onDayChange: (day: string) => void;
}) {
  const days = weekDays(data.weekRange);

  return (
    <div className="flex-1 overflow-auto">
      {/* Day picker + status legend */}
      <div className="sticky left-0 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-2 dark:border-slate-800">
        <DayPicker days={days} selected={day} onChange={onDayChange} />
        <StatusLegend />
      </div>

      <div style={{ minWidth: LABEL_W + TRACK_W }}>
        {/* Time axis header */}
        <div className="sticky top-0 z-20 flex border-b-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <div
            className="sticky left-0 z-30 shrink-0 border-r border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500"
            style={{ width: LABEL_W }}
          >
            Route
          </div>
          <div className="relative" style={{ width: TRACK_W, height: 28 }}>
            {HOURS.map((h, i) => {
              const transform = i === 0 ? 'translateX(0)' : i === HOURS.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)';
              return (
                <div
                  key={h}
                  className="num absolute top-1.5 text-[10px] text-slate-400 dark:text-slate-500"
                  style={{ left: (h * 60 - START_MIN) * PX_PER_MIN, transform }}
                >
                  {hourLabel(h)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resource rows */}
        {data.routes.map((route) => {
          const visits = data.visits.filter((v) => v.routeId === route.id && localDate(v.start) === day);
          return (
            <div key={route.id} className="flex border-b border-slate-200 dark:border-slate-800">
              {/* Resource label (sticky left) */}
              <div
                className="sticky left-0 z-10 flex shrink-0 flex-col justify-center gap-0.5 border-r border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950"
                style={{ width: LABEL_W, height: ROW_H }}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-3 w-1.5 rounded-full ${routeEdge[route.color]}`} aria-hidden />
                  <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-50">{route.name}</span>
                </div>
                <div className="num truncate text-[9px] text-slate-400 dark:text-slate-500">
                  {route.members.map((m) => m.avatarInitials).join(' · ')}
                </div>
              </div>

              {/* Track */}
              <div className="relative" style={{ width: TRACK_W, height: ROW_H }}>
                {HOURS.map((h, i) => (
                  <div
                    key={h}
                    className="absolute inset-y-0 border-l border-slate-100 dark:border-slate-800/60"
                    style={{ left: i * PX_PER_HOUR }}
                  />
                ))}
                {visits.map((visit) => (
                  <GridVisitBlock
                    key={visit.id}
                    visit={visit}
                    top={4}
                    height={ROW_H - 8}
                    left={`${(minutesOfDay(visit.start) - START_MIN) * PX_PER_MIN}px`}
                    width={`${Math.max(40, visit.durationMinutes * PX_PER_MIN)}px`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
