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
  // 매주 반복처럼 한 주에 회차가 둘 걸칠 수 있어서, 같은 회차가 덮는 칸끼리 묶어 막대 하나로 만든다.
  const pieces = events.filter(isMultiDay).flatMap((event) => {
    const runs: { start: DateKey; startCol: number; endCol: number }[] = [];
    week.forEach((day, col) => {
      const start = day ? coveringStart(event, day) : null;
      if (!start) return;
      const last = runs[runs.length - 1];
      if (last && last.start === start && last.endCol === col - 1) last.endCol = col;
      else runs.push({ start, startCol: col, endCol: col });
    });
    return runs.map(({ start, startCol, endCol }) => {
      const end = addDays(start, spanDays(event));
      return { event, start, startCol, endCol, contLeft: start < week[startCol]!, contRight: end > week[endCol]! };
    });
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
