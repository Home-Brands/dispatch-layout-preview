import { hourLabel } from '../data/model';

/**
 * Left time gutter for the grid variants. Labels sit centered on their hour
 * line — EXCEPT the first and last, which are anchored just inside the top and
 * bottom edges so they don't bleed across the band boundary into the route
 * header or the separator below it.
 */
export function HourGutter({
  hours,
  startMin,
  pxPerMin,
  height,
}: {
  hours: number[];
  startMin: number;
  pxPerMin: number;
  height: number;
}) {
  const last = hours.length - 1;
  return (
    <div className="relative border-r border-slate-200 dark:border-slate-800" style={{ height }}>
      {hours.map((h, i) => {
        // First label top-aligns under its line; last bottom-aligns above its
        // line; the rest center on their line.
        const transform = i === 0 ? 'translateY(0)' : i === last ? 'translateY(-100%)' : 'translateY(-50%)';
        return (
          <div
            key={h}
            className="num absolute right-1 text-[9px] text-slate-400 dark:text-slate-500"
            style={{ top: (h * 60 - startMin) * pxPerMin, transform }}
          >
            {hourLabel(h)}
          </div>
        );
      })}
    </div>
  );
}
