import raw from './sample-data.json';

// ---------------------------------------------------------------------------
// Types — match the actual sample-data.json shape. Note the visit time field
// is `start` (the design types.ts calls it `startAt`; the JSON drifted — we
// render from the JSON, so `start` is authoritative here).
// ---------------------------------------------------------------------------

export type StatusColor = 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet';
export type RouteColor = 'indigo' | 'emerald' | 'violet' | 'sky' | 'amber' | 'rose' | 'teal';
export type VisitPriority = 'low' | 'normal' | 'urgent';

export interface VisitStatus {
  id: string;
  label: string;
  color: StatusColor;
  isDefault: boolean;
}

export interface RouteMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  color: RouteColor;
  members: RouteMember[];
}

export interface Visit {
  id: string;
  routeId: string;
  customerName: string;
  propertyAddress: string;
  serviceType: string;
  /** ISO-8601 with offset, e.g. 2026-04-13T08:30:00-04:00 */
  start: string;
  durationMinutes: number;
  statusId: string;
  notes: string;
}

export interface UnassignedVisit {
  id: string;
  customerName: string;
  propertyAddress: string;
  serviceType: string;
  requestedWindow: string;
  durationMinutes: number;
  priority: VisitPriority;
  sourceChannel: string;
}

export interface AiSuggestion {
  id: string;
  unassignedVisitId: string;
  proposedRouteId: string;
  proposedStart: string;
  rationale: string;
  confidence: number;
}

export interface Anomaly {
  id: string;
  routeId: string;
  severity: 'info' | 'warning' | 'critical';
  label: string;
  reason: string;
  affectedDate: string;
}

export interface WeekRange {
  start: string;
  end: string;
  todayIso: string;
}

export interface CurrentScope {
  brand?: string;
  location?: string;
}

export interface Dataset {
  weekRange: WeekRange;
  statuses: VisitStatus[];
  routes: Route[];
  visits: Visit[];
  unassignedQueue: UnassignedVisit[];
  aiSuggestions: AiSuggestion[];
  anomalies: Anomaly[];
  currentScope?: CurrentScope;
}

export const data = raw as unknown as Dataset;

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const statusById: Record<string, VisitStatus> = Object.fromEntries(
  data.statuses.map((s) => [s.id, s]),
);
export const routeById: Record<string, Route> = Object.fromEntries(
  data.routes.map((r) => [r.id, r]),
);

export function anomaliesForRoute(routeId: string): Anomaly[] {
  return data.anomalies.filter((a) => a.routeId === routeId);
}

// ---------------------------------------------------------------------------
// Timezone-safe date/time helpers.
//
// Every timestamp carries its own offset (…-04:00), so the date and wall-clock
// time live in the string itself. Slicing avoids `new Date(iso)` re-projecting
// into the viewer's browser timezone (the offset bug dispatch-helpers.ts warns
// about). Calendar-date arithmetic uses UTC Date purely as a day counter.
// ---------------------------------------------------------------------------

/** Local calendar day of an offset-carrying ISO timestamp: '2026-04-13'. */
export const localDate = (iso: string): string => iso.slice(0, 10);

/** Local wall-clock 'HH:MM' of an offset-carrying ISO timestamp. */
export const localHHMM = (iso: string): string => iso.slice(11, 16);

/** Minutes since local midnight for an offset-carrying ISO timestamp. */
export function minutesOfDay(iso: string): number {
  const [h, m] = localHHMM(iso).split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** The 7 ISO calendar days of a week range, inclusive of start. */
export function weekDays(week: WeekRange): string[] {
  const [y, m, d] = week.start.split('-').map(Number);
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, (d ?? 1) + i));
    return dt.toISOString().slice(0, 10);
  });
}

/** { dow: 'Mon', md: 'Apr 13' } for an ISO calendar date. */
export function dayLabel(isoDate: string): { dow: string; md: string } {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
  return {
    dow: dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    md: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
  };
}

/** Compact 12-hour time: '8a', '10:30a', '12p', '5:30p'. */
export function fmtTime(iso: string): string {
  const [h, m] = localHHMM(iso).split(':').map(Number);
  const hour = h ?? 0;
  const minute = m ?? 0;
  const suffix = hour >= 12 ? 'p' : 'a';
  const displayH = hour % 12 || 12;
  return minute === 0 ? `${displayH}${suffix}` : `${displayH}:${String(minute).padStart(2, '0')}${suffix}`;
}

/** Readable visit length: '45m', '1h', '2h 30m'. */
export function fmtDuration(minutes: number): string {
  const min = Math.max(0, Math.round(minutes));
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const r = min % 60;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
}

/** Compact 12-hour label for an hour-of-day integer: '6a', '12p', '5p'. */
export function hourLabel(hour24: number): string {
  const suffix = hour24 >= 12 ? 'p' : 'a';
  const h = hour24 % 12 || 12;
  return `${h}${suffix}`;
}

/** Minutes-of-day (e.g. 870) → compact 12-hour time '2:30p'. */
export function fmtMinutes(totalMin: number): string {
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const suffix = h >= 12 ? 'p' : 'a';
  const displayH = h % 12 || 12;
  return m === 0 ? `${displayH}${suffix}` : `${displayH}:${String(m).padStart(2, '0')}${suffix}`;
}
