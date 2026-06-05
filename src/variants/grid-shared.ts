import { minutesOfDay, type Visit } from '../data/model';

// Shared geometry for the two time-grid variants (Week grid, Day grid).
// The visible window is 7:00–19:00 (matches the app's picker bounds, with a
// little headroom). Pixel height is fixed so blocks position deterministically.

export const DAY_START_MIN = 6 * 60; // 6:00a — sample data has 6:30a starts
export const DAY_END_MIN = 19 * 60; // 7:00p
export const PX_PER_HOUR = 56;
export const PX_PER_MIN = PX_PER_HOUR / 60;
export const GRID_HEIGHT = ((DAY_END_MIN - DAY_START_MIN) / 60) * PX_PER_HOUR;

/** Hour tick rows for the time gutter / background lines. */
export const HOURS: number[] = Array.from(
  { length: (DAY_END_MIN - DAY_START_MIN) / 60 + 1 },
  (_, i) => DAY_START_MIN / 60 + i,
);

/** Top offset (px) for a visit, clamped to the visible window. */
export function topPx(visit: Visit): number {
  return Math.max(0, (minutesOfDay(visit.start) - DAY_START_MIN) * PX_PER_MIN);
}

/** Height (px) for a visit, with a readable minimum. */
export function heightPx(visit: Visit): number {
  return Math.max(22, visit.durationMinutes * PX_PER_MIN);
}

export interface PlacedVisit {
  visit: Visit;
  lane: number;
  laneCount: number;
}

/**
 * Side-by-side packing for visits that overlap in time. Greedy first-fit:
 * each visit takes the first lane whose previous visit has already ended.
 * `laneCount` is the max concurrency across the day, so every block in the
 * day shares the same column width (calendar-app behavior).
 */
export function packLanes(visits: Visit[]): PlacedVisit[] {
  const sorted = [...visits].sort((a, b) => minutesOfDay(a.start) - minutesOfDay(b.start));
  const laneEnds: number[] = []; // end-minute of the last visit placed in each lane
  const placed: Array<{ visit: Visit; lane: number }> = [];

  for (const visit of sorted) {
    const start = minutesOfDay(visit.start);
    const end = start + visit.durationMinutes;
    let lane = laneEnds.findIndex((e) => e <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    placed.push({ visit, lane });
  }

  const laneCount = Math.max(1, laneEnds.length);
  return placed.map((p) => ({ ...p, laneCount }));
}
