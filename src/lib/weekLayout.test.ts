import { monthGrid } from './date';
import type { CalEvent } from './events';
import { weekSegments } from './weekLayout';

const ev = (id: string, date: string, endDate?: string): CalEvent => ({
  id, title: id, date, endDate, time: null, icon: 'plane', repeat: 'none',
});

const trip = ev('trip', '2026-10-16', '2026-10-19');
const fam = ev('fam', '2026-10-17', '2026-10-18');
const camp = ev('camp', '2026-10-18', '2026-10-19');
const oneDay = ev('one', '2026-10-18');
const weeks = (() => {
  const g = monthGrid(2026, 10);
  return Array.from({ length: g.length / 7 }, (_, i) => g.slice(i * 7, i * 7 + 7));
})();

test('여러 날 일정만 막대로 만들고, 주가 바뀌면 잘라서 이어진다고 표시한다', () => {
  const w3 = weekSegments([trip, oneDay], weeks[2]); // 10월 11일 ~ 17일
  expect(w3).toEqual([{ event: trip, startCol: 5, endCol: 6, lane: 0, contLeft: false, contRight: true }]);
  const w4 = weekSegments([trip], weeks[3]); // 10월 18일 ~ 24일
  expect(w4).toEqual([{ event: trip, startCol: 0, endCol: 1, lane: 0, contLeft: true, contRight: false }]);
});

test('겹치면 먼저 시작한 일정이 위층, 그다음 빈 층을 쓴다', () => {
  const w4 = weekSegments([camp, fam, trip], weeks[3]);
  expect(w4.map((s) => [s.event.id, s.lane])).toEqual([['trip', 0], ['fam', 1], ['camp', 2]]);
});

test('같은 날 시작하면 더 긴 일정이 위층이다', () => {
  const long = ev('long', '2026-10-05', '2026-10-09');
  const short = ev('short', '2026-10-05', '2026-10-06');
  expect(weekSegments([short, long], weeks[1]).map((s) => s.event.id)).toEqual(['long', 'short']);
});

test('겹치지 않으면 같은 층을 다시 쓴다', () => {
  const a = ev('a', '2026-10-05', '2026-10-06');
  const b = ev('b', '2026-10-08', '2026-10-09');
  expect(weekSegments([a, b], weeks[1]).map((s) => s.lane)).toEqual([0, 0]);
});

test('달 밖에서 시작한 일정은 그 달 첫날부터 이어진다고 표시한다', () => {
  const cross = ev('cross', '2026-09-29', '2026-10-02');
  expect(weekSegments([cross], weeks[0])).toEqual([
    { event: cross, startCol: 4, endCol: 5, lane: 0, contLeft: true, contRight: false },
  ]);
});

test('매주 반복하는 금~일 일정은 한 주에 두 회차의 막대로 나뉘고, 그 사이 평일은 비운다', () => {
  const weekend: CalEvent = { ...ev('wk', '2026-10-02', '2026-10-04'), repeat: 'weekly' };
  const w3 = weekSegments([weekend], weeks[2]); // 10월 11일(일) ~ 17일(토)
  expect(w3).toEqual([
    { event: weekend, startCol: 0, endCol: 0, lane: 0, contLeft: true, contRight: false },
    { event: weekend, startCol: 5, endCol: 6, lane: 0, contLeft: false, contRight: true },
  ]);
});
