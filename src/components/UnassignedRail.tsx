import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  GripVertical,
  Inbox,
  Phone,
  Share2,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import { AiSuggestionCard } from './AiSuggestionCard';
import { data, routeById, type UnassignedVisit, type VisitPriority } from '../data/model';

const PRIORITY_STYLES: Record<VisitPriority, string> = {
  urgent: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
  normal: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  low: 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-500',
};

const CHANNEL_ICONS: Record<string, LucideIcon> = {
  online_booking: Globe,
  phone: Phone,
  sales_handoff: UserCheck,
  referral: Share2,
  manual: Inbox,
};

const CHANNEL_LABEL: Record<string, string> = {
  online_booking: 'Online',
  phone: 'Phone',
  sales_handoff: 'Sales',
  referral: 'Referral',
  manual: 'Manual',
};

function UnassignedItem({ item }: { item: UnassignedVisit }) {
  const ChannelIcon = CHANNEL_ICONS[item.sourceChannel] ?? Inbox;
  return (
    <div className="group relative cursor-grab rounded-lg border border-slate-200 bg-white p-2.5 transition-all hover:-translate-y-px hover:border-slate-300 hover:shadow-sm active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[item.priority]}`}>
          {item.priority}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
          <ChannelIcon className="h-3 w-3" />
          {CHANNEL_LABEL[item.sourceChannel] ?? item.sourceChannel}
        </span>
      </div>

      <div className="mb-0.5 truncate text-[13px] font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-50">
        {item.customerName}
      </div>
      <div className="mb-1.5 truncate text-[11px] leading-tight text-slate-500 dark:text-slate-400">
        {item.serviceType}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="truncate">{item.requestedWindow}</span>
        <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500">{item.durationMinutes}m</span>
      </div>

      <GripVertical className="absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600" />
    </div>
  );
}

/**
 * Unassigned queue rail — ported from the dispatch-board section's
 * UnassignedQueue.tsx: header with count + hint, draggable item cards with
 * priority + source channel, and dashed AI-suggestion cards that replace the
 * item when AI has a placement. Collapses to a vertical rail like the design.
 */
export function UnassignedRail() {
  const [collapsed, setCollapsed] = useState(false);
  const queue = data.unassignedQueue;
  const suggestionsByVisit = new Map(data.aiSuggestions.map((s) => [s.unassignedVisitId, s]));

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="flex w-10 shrink-0 flex-col items-center gap-3 border-l border-slate-200 bg-white py-4 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900"
        aria-label="Expand unassigned queue"
      >
        <ChevronLeft className="h-4 w-4" />
        <Inbox className="h-4 w-4" />
        {queue.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            {queue.length}
          </span>
        )}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ writingMode: 'vertical-rl' }}>
          Unassigned
        </span>
      </button>
    );
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">Unassigned</h2>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {queue.length}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Drag onto a route, or accept an AI suggestion.</p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          aria-label="Collapse"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {queue.map((item) => {
            const suggestion = suggestionsByVisit.get(item.id);
            return suggestion ? (
              <AiSuggestionCard
                key={item.id}
                suggestion={suggestion}
                visit={item}
                route={routeById[suggestion.proposedRouteId]}
              />
            ) : (
              <UnassignedItem key={item.id} item={item} />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
