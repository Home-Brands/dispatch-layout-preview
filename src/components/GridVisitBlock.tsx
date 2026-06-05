import { fmtTime, statusById, type Visit } from '../data/model';
import { statusBadge, statusEdge } from '../theme-maps';

// Content tiers by available height. The left edge bar always conveys status,
// so on short blocks we drop the (redundant) badge first, then the service
// line — instead of letting overflow clip a half-rendered label.
const SHOW_SERVICE_MIN = 34;
const SHOW_BADGE_MIN = 52;

/**
 * Absolutely-positioned visit block for the time-grid variants. Same visual
 * language as the swimlane's VisitTile — white card, status-colored left edge
 * bar, status badge — but content degrades gracefully as the block (sized by
 * duration) gets shorter, so labels never clip.
 */
export function GridVisitBlock({
  visit,
  top,
  height,
  left,
  width,
}: {
  visit: Visit;
  top: number;
  height: number;
  left: string;
  width: string;
}) {
  const status = statusById[visit.statusId];
  const showService = height >= SHOW_SERVICE_MIN;
  const showBadge = status && height >= SHOW_BADGE_MIN;

  return (
    <div
      style={{ top, height, left, width }}
      title={`${fmtTime(visit.start)} · ${visit.customerName} — ${visit.serviceType}${status ? ` (${status.label})` : ''}`}
      className="absolute overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${status ? statusEdge[status.color] : 'bg-slate-300'}`}
        aria-hidden
      />
      <div className="py-0.5 pl-2 pr-1 leading-tight">
        <div className="flex items-baseline gap-1">
          <span className="num shrink-0 text-[10px] font-semibold text-slate-500 dark:text-slate-400">{fmtTime(visit.start)}</span>
          <span className="line-clamp-1 text-[11px] font-semibold text-slate-900 dark:text-slate-50">
            {visit.customerName}
          </span>
        </div>
        {showService && (
          <div className="line-clamp-1 text-[10px] text-slate-600 dark:text-slate-300">{visit.serviceType}</div>
        )}
        {showBadge && (
          <span
            className={`mt-0.5 inline-flex items-center rounded-sm px-1 py-px font-mono text-[9px] font-bold uppercase tracking-wider ${statusBadge[status.color]}`}
          >
            {status.label}
          </span>
        )}
      </div>
    </div>
  );
}
