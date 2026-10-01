import { addDays, DateKey } from './date';
import { CalEvent, coveringStart, isMultiDay, spanDays } from './events';

export type Segment = {
  event: CalEvent;
  startCol: number;
  endCol: number;
  lane: number;
  contLeft: boolean;
  contRight: boolean;
};

// 한 주(7칸, 달 밖은 null)에 그릴 여러 날 일정 막대와 층을 정한다.
// 먼저 시작한 일정, 같은 날이면 더 긴 일정이 위층이고, 가장 낮은 빈 층을 쓴다.
export function weekSegments(events: CalEvent[], week: (DateKey | null)[]): Segment[] {
  const pieces = events.filter(isMultiDay).flatMap((event) => {
    const cols = week.flatMap((day, col) => (day && coveringStart(event, day) ? [col] : []));
    if (cols.length === 0) return [];
    const startCol = cols[0];
    const endCol = cols[cols.length - 1];
    const start = coveringStart(event, week[startCol]!)!;
    const end = addDays(start, spanDays(event));
    return [{ event, start, startCol, endCol, contLeft: start < week[startCol]!, contRight: end > week[endCol]! }];
  });

  pieces.sort(
    (a, b) =>
      a.start.localeCompare(b.start) || spanDays(b.event) - spanDays(a.event) || a.event.id.localeCompare(b.event.id),
  );

  const lanes: [number, number][][] = [];
  return pieces.map(({ start: _start, ...p }) => {
    let lane = 0;
    while ((lanes[lane] ?? []).some(([a, b]) => p.startCol <= b && p.endCol >= a)) lane++;
    (lanes[lane] ??= []).push([p.startCol, p.endCol]);
    return { event: p.event, startCol: p.startCol, endCol: p.endCol, lane, contLeft: p.contLeft, contRight: p.contRight };
  });
}
