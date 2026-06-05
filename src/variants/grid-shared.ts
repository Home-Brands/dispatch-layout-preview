import { minutesOfDay, type Visit } from '../data/model';

// Lane packing for the time-grid variants. Each variant owns its own time
// window + pixel scale (fit to its data); the only thing they share is how
// overlapping visits get placed side-by-side.

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
