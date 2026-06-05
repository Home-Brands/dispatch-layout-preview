import { dayLabel } from '../data/model';

/** Segmented day-of-week selector. Shared by the Day grid and Gantt board. */
export function DayPicker({
  days,
  selected,
  onChange,
}: {
  days: string[];
  selected: string;
  onChange: (day: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {days.map((d) => {
        const { dow, md } = dayLabel(d);
        const active = d === selected;
        return (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
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
  );
}
