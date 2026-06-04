import { data } from '../data/model';
import { routeDot } from '../theme-maps';

/** Maps each route color to its name — shown where color encodes the route. */
export function RouteLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Routes
      </span>
      {data.routes.map((route) => (
        <span key={route.id} className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <span className={`h-2.5 w-2.5 rounded-sm ${routeDot[route.color]}`} aria-hidden />
          {route.name}
        </span>
      ))}
    </div>
  );
}
