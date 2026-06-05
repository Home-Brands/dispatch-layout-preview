import { GridVisitBlock } from '../components/GridVisitBlock';
import { HourGutter } from '../components/HourGutter';
import {
  anomaliesForRoute,
  data,
  dayLabel,
  localDate,
  minutesOfDay,
  weekDays,
  type Route,
} from '../data/model';
import { routeEdge } from '../theme-maps';
import { packLanes } from './grid-shared';

const COL_TEMPLATE = '52px repeat(7, minmax(150px, 1fr))';
const PX_PER_HOUR = 40;
const PX_PER_MIN = PX_PER_HOUR / 60;

// Fit the time window to the data's actual range (whole hours), so bands stay
// compact instead of spanning a fixed 6a–7p. Shared across every band so the
// same vertical position means the same time of day in every route.
const allStarts = data.visits.map((v) => minutesOfDay(v.start));
const allEnds = data.visits.map((v) => minutesOfDay(v.start) + v.durationMinutes);
const START_MIN = Math.floor(Math.min(...allStarts) / 60) * 60;
const END_MIN = Math.ceil(Math.max(...allEnds) / 60) * 60;
const BAND_HEIGHT = ((END_MIN - START_MIN) / 60) * PX_PER_HOUR;
const HOURS = Array.from(
  { length: (END_MIN - START_MIN) / 60 + 1 },
  (_, i) => START_MIN / 60 + i,
);

function Avatars({ route }: { route: Route }) {
  return (
    <div className="flex -space-x-1">
      {route.members.slice(0, 3).map((m) => (
        <span
          key={m.id}
          title={`${m.name} — ${m.role}`}
          className={`num inline-flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-950 ${routeEdge[route.color]}`}
        >
          {m.avatarInitials}
        </span>
      ))}
    </div>
  );
}

/** A single day column inside one route's band: that route's visits for that
 * day, positioned by time and colored by status. */
function RouteDayColumn({ routeId, day, isToday, hasAnomaly }: {
  routeId: string;
  day: string;
  isToday: boolean;
  hasAnomaly: boolean;
}) {
  const placed = packLanes(
    data.visits.filter((v) => v.routeId === routeId && localDate(v.start) === day),
  );
  return (
    <div
      className={`relative border-r border-slate-200 dark:border-slate-800 ${
        isToday ? 'bg-indigo-50/40 dark:bg-indigo-500/[0.04]' : ''
      } ${hasAnomaly ? 'ring-1 ring-inset ring-amber-300/70 dark:ring-amber-500/30' : ''}`}
      style={{ height: BAND_HEIGHT }}
    >
      {HOURS.map((h, i) => (
        <div
          key={h}
          className="absolute inset-x-0 border-t border-slate-100 dark:border-slate-800/60"
          style={{ top: i * PX_PER_HOUR }}
        />
      ))}
      {placed.map(({ visit, lane, laneCount }) => (
        <GridVisitBlock
          key={visit.id}
          visit={visit}
          top={Math.max(0, (minutesOfDay(visit.start) - START_MIN) * PX_PER_MIN)}
          height={Math.max(20, visit.durationMinutes * PX_PER_MIN)}
          left={`calc(${(lane * 100) / laneCount}% + 2px)`}
          width={`calc(${100 / laneCount}% - 4px)`}
        />
      ))}
    </div>
  );
}

/**
 * Week grid — the swimlane view "expanded" with a time-of-day axis. Routes are
 * stacked vertically (one band each); within a band, the week's 7 days each get
 * an hourly timeline so visits sit at their real clock times. No two routes
 * ever share a grid, so a day never shows competing routes. Color encodes
 * status (the route is already the band).
 */
export function WeekGridVariant() {
  const days = weekDays(data.weekRange);
  const { todayIso } = data.weekRange;

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[1100px]">
        {/* Sticky day header */}
        <div
          className="sticky top-0 z-20 grid border-b-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
          style={{ gridTemplateColumns: COL_TEMPLATE }}
        >
          <div />
          {days.map((day) => {
            const { dow, md } = dayLabel(day);
            const isToday = day === todayIso;
            return (
              <div
                key={day}
                className={`border-l border-slate-200 px-2 py-1.5 text-center dark:border-slate-800 ${
                  isToday ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${isToday ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>
                  {dow}{' '}
                </span>
                <span className={`num text-[11px] font-semibold ${isToday ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-300'}`}>
                  {md.replace(/^\w+ /, '')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Route bands, stacked */}
        {data.routes.map((route) => {
          const anomalies = anomaliesForRoute(route.id);
          return (
            <section key={route.id} className="border-b-4 border-slate-100 dark:border-slate-900">
              {/* Band header (full width) */}
              <div className="flex items-center gap-2.5 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                <span className={`h-3.5 w-1.5 rounded-full ${routeEdge[route.color]}`} aria-hidden />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{route.name}</span>
                <Avatars route={route} />
                {anomalies.length > 0 && (
                  <span
                    title={anomalies.map((a) => a.reason).join('\n')}
                    className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                  >
                    ⚠ {anomalies[0]!.label}
                  </span>
                )}
                <span className="ml-auto truncate text-[10px] text-slate-400 dark:text-slate-500">{route.description}</span>
              </div>

              {/* Time grid for this route */}
              <div className="grid" style={{ gridTemplateColumns: COL_TEMPLATE }}>
                <HourGutter hours={HOURS} startMin={START_MIN} pxPerMin={PX_PER_MIN} height={BAND_HEIGHT} />
                {days.map((day) => (
                  <RouteDayColumn
                    key={day}
                    routeId={route.id}
                    day={day}
                    isToday={day === todayIso}
                    hasAnomaly={anomalies.some((a) => a.affectedDate === day)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
