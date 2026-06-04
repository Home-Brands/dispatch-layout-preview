import { Chrome } from './components/Chrome';
import { UnassignedRail } from './components/UnassignedRail';
import { DEFAULT_VARIANT, isVariant, type VariantKey } from './config';
import { data, weekDays } from './data/model';
import { useUrl } from './useUrl';
import { ResourceDayGridVariant } from './variants/ResourceDayGridVariant';
import { SwimlaneVariant } from './variants/SwimlaneVariant';
import { WeekGridVariant } from './variants/WeekGridVariant';

export function App() {
  const { params, update } = useUrl();

  const variantParam = params.get('variant');
  const variant: VariantKey = isVariant(variantParam) ? variantParam : DEFAULT_VARIANT;

  const days = weekDays(data.weekRange);
  const dayParam = params.get('day');
  const day = dayParam && days.includes(dayParam) ? dayParam : data.weekRange.todayIso;

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Chrome variant={variant} onVariant={(v) => update({ variant: v })} />

      <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
        Visual prototype · sample data, not live — flip between layouts and tell us which you prefer.
      </div>

      <div className="flex flex-1 overflow-hidden">
        {variant === 'swimlane' && <SwimlaneVariant />}
        {variant === 'week' && <WeekGridVariant />}
        {variant === 'resource' && (
          <ResourceDayGridVariant day={day} onDayChange={(d) => update({ day: d })} />
        )}
        <UnassignedRail />
      </div>
    </div>
  );
}
