import { DayPicker } from '../components/DayPicker';
import { GridVisitBlock } from '../components/GridVisitBlock';
import { HourGutter } from '../components/HourGutter';
import { StatusLegend } from '../components/StatusLegend';
import { data, localDate, minutesOfDay, weekDays } from '../data/model';
import { routeEdge } from '../theme-maps';
import { packLanes } from './grid-shared';

// Show the full operating day (6a–7p) with hours, including empty afternoon
// slots — dispatchers want to see open capacity, not just booked time.
const PX_PER_HOUR = 56;
const PX_PER_MIN = PX_PER_HOUR / 60;
const START_MIN = 6 * 60; // 6:00a
const END_MIN = 19 * 60; // 7:00p
const GRID_HEIGHT = ((END_MIN - START_MIN) / 60) * PX_PER_HOUR;
const HOURS = Array.from({ length: (END_MIN - START_MIN) / 60 + 1 }, (_, i) => START_MIN / 60 + i);

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
        <DayPicker days={days} selected={day} onChange={onDayChange} />
        <StatusLegend />
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
        <HourGutter hours={HOURS} startMin={START_MIN} pxPerMin={PX_PER_MIN} height={GRID_HEIGHT} />

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
              {placed.map(({ visit, lane, laneCount }) => (
                <GridVisitBlock
                  key={visit.id}
                  visit={visit}
                  top={Math.max(0, (minutesOfDay(visit.start) - START_MIN) * PX_PER_MIN)}
                  height={Math.max(22, visit.durationMinutes * PX_PER_MIN)}
                  left={`calc(${(lane * 100) / laneCount}% + 2px)`}
                  width={`calc(${100 / laneCount}% - 4px)`}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Scroll-past room — so the pane always has give and never feels like a
          dead box, even when the calendar fits the screen. */}
      <div className="h-[40vh] shrink-0" aria-hidden />
    </div>
  );
}
