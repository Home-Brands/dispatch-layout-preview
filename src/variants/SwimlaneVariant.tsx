import { VisitTile } from '../components/VisitTile';
import {
  anomaliesForRoute,
  data,
  dayLabel,
  fmtTime,
  localDate,
  minutesOfDay,
  weekDays,
  type Route,
} from '../data/model';
import { routeEdge } from '../theme-maps';

const COL_TEMPLATE = '232px repeat(7, minmax(168px, 1fr))';

function Avatars({ route }: { route: Route }) {
  return (
    <div className="flex -space-x-1">
      {route.members.slice(0, 3).map((m) => (
        <span
          key={m.id}
          title={`${m.name} — ${m.role}`}
          className={`num inline-flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-900 ${routeEdge[route.color]}`}
        >
          {m.avatarInitials}
        </span>
      ))}
    </div>
  );
}

/**
 * Route swimlanes — the current spec'd layout. One horizontal lane per route,
 * a 7-day timeline across. Structure (not just color) carries the route: each
 * route owns its strip, so work never collides on a shared grid.
 */
export function SwimlaneVariant() {
  const days = weekDays(data.weekRange);
  const { todayIso } = data.weekRange;

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid min-w-[1400px]" style={{ gridTemplateColumns: COL_TEMPLATE }}>
        {/* ── Header row ── */}
        <div className="sticky left-0 top-0 z-20 border-b-2 border-r border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Route
          </div>
        </div>
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
              <div
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isToday ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {dow}
              </div>
              <div className={`num text-xs font-semibold ${isToday ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>
                {md}
              </div>
            </div>
          );
        })}

        {/* ── Route rows ── */}
        {data.routes.map((route) => {
          const anomalies = anomaliesForRoute(route.id);
          return (
            <div key={route.id} className="contents">
              {/* Route header (sticky left) */}
              <div className="sticky left-0 z-10 flex flex-col gap-1.5 border-b border-r border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <span className={`h-3.5 w-1.5 rounded-full ${routeEdge[route.color]}`} aria-hidden />
                  <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {route.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Avatars route={route} />
                  {anomalies.length > 0 && (
                    <span
                      title={anomalies.map((a) => a.reason).join('\n')}
                      className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                    >
                      ⚠ {anomalies[0]!.label}
                    </span>
                  )}
                </div>
                <div className="truncate text-[10px] text-slate-400 dark:text-slate-500">{route.description}</div>
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const visits = data.visits
                  .filter((v) => v.routeId === route.id && localDate(v.start) === day)
                  .sort((a, b) => minutesOfDay(a.start) - minutesOfDay(b.start));
                const suggestions = data.aiSuggestions.filter(
                  (s) => s.proposedRouteId === route.id && localDate(s.proposedStart) === day,
                );
                const isToday = day === todayIso;
                const hasAnomaly = anomalies.some((a) => a.affectedDate === day);

                return (
                  <div
                    key={day}
                    className={`min-h-[84px] space-y-1.5 border-b border-r border-slate-200 p-1.5 dark:border-slate-800 ${
                      isToday ? 'bg-indigo-50/40 dark:bg-indigo-500/[0.04]' : ''
                    } ${hasAnomaly ? 'ring-1 ring-inset ring-amber-300/70 dark:ring-amber-500/30' : ''}`}
                  >
                    {visits.map((v) => (
                      <VisitTile key={v.id} visit={v} />
                    ))}
                    {suggestions.map((s) => {
                      const u = data.unassignedQueue.find((x) => x.id === s.unassignedVisitId);
                      return (
                        <div
                          key={s.id}
                          title={s.rationale}
                          className="rounded-md border border-dashed border-indigo-300 bg-indigo-50/50 px-2 py-1.5 dark:border-indigo-500/40 dark:bg-indigo-500/10"
                        >
                          <div className="num text-[9px] font-semibold text-indigo-500 dark:text-indigo-300">
                            AI · {fmtTime(s.proposedStart)}
                          </div>
                          <div className="line-clamp-1 text-[10px] font-medium text-indigo-700 dark:text-indigo-200">
                            {u?.customerName ?? 'Suggested visit'}
                          </div>
                        </div>
                      );
                    })}
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
