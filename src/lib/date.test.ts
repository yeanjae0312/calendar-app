import {
  addDays, addMinutes, addMonths, formatMonthDay, diffDays, formatDateChip, formatTimeRange, formatDay, formatDot, formatShort, formatTime, fromWheel, toWheel,
  hhmmToDate, keyToDate, monthGrid, toHHMM, toKey,
} from './date';

test('toKey는 로컬 날짜를 YYYY-MM-DD로 바꾼다', () => {
  expect(toKey(new Date(2026, 9, 30))).toBe('2026-10-30');
});

test('diffDays는 두 날짜 사이의 날 수를 센다', () => {
  expect(diffDays('2025-08-15', '2026-10-30')).toBe(441);
  expect(diffDays('2026-10-30', '2026-12-12')).toBe(43);
  expect(diffDays('2026-10-30', '2026-10-01')).toBe(-29);
  expect(diffDays('2026-03-28', '2026-03-30')).toBe(2);
});

test('2026년 10월은 목요일에 시작하고 5주다', () => {
  const g = monthGrid(2026, 10);
  expect(g).toHaveLength(35);
  expect(g.slice(0, 4)).toEqual([null, null, null, null]);
  expect(g[4]).toBe('2026-10-01');
  expect(g[34]).toBe('2026-10-31');
});

test('2026년 2월은 일요일에 시작하고 딱 4주다', () => {
  const g = monthGrid(2026, 2);
  expect(g).toHaveLength(28);
  expect(g[0]).toBe('2026-02-01');
});

test('addMonths는 연도를 넘긴다', () => {
  expect(addMonths(2026, 12, 1)).toEqual({ y: 2027, m: 1 });
  expect(addMonths(2026, 1, -1)).toEqual({ y: 2025, m: 12 });
});

test('날짜와 시간 표시', () => {
  expect(formatDay('2026-10-17')).toBe('10월 17일 토요일');
  expect(formatShort('2026-11-02')).toBe('11월 2일 월');
  expect(formatDot('2025-08-15')).toBe('2025.08.15');
  expect(formatTime('14:00')).toBe('오후 2:00');
  expect(formatTime('00:30')).toBe('오전 12:30');
  expect(formatTime('12:00')).toBe('오후 12:00');
  expect(formatTime('09:05')).toBe('오전 9:05');
});

test('시간 문자열과 Date 변환', () => {
  expect(toHHMM(new Date(2026, 0, 1, 9, 5))).toBe('09:05');
  const d = hhmmToDate('14:05');
  expect([d.getHours(), d.getMinutes()]).toEqual([14, 5]);
  expect(toKey(keyToDate('2026-02-28'))).toBe('2026-02-28');
});

test('날짜 칩 표시', () => {
  expect(formatDateChip('2026-10-17')).toBe('2026. 10. 17.');
  expect(formatDateChip('2027-01-05')).toBe('2027. 1. 5.');
});

test('시간 문자열을 휠 세 칸 값으로 나누고 다시 합친다', () => {
  expect(toWheel('14:00')).toEqual({ ap: 1, h: 2, m: 0 });
  expect(toWheel('00:30')).toEqual({ ap: 0, h: 12, m: 30 });
  expect(toWheel('12:05')).toEqual({ ap: 1, h: 12, m: 5 });
  expect(toWheel('09:58')).toEqual({ ap: 0, h: 9, m: 55 });
  expect(fromWheel({ ap: 1, h: 2, m: 0 })).toBe('14:00');
  expect(fromWheel({ ap: 0, h: 12, m: 30 })).toBe('00:30');
  expect(fromWheel({ ap: 1, h: 12, m: 5 })).toBe('12:05');
});

test('시간에 분을 더하되 그날 23:55를 넘기지 않는다', () => {
  expect(addMinutes('14:00', 60)).toBe('15:00');
  expect(addMinutes('09:30', 45)).toBe('10:15');
  expect(addMinutes('23:30', 60)).toBe('23:55');
});

test('시간 범위 표시', () => {
  expect(formatTimeRange('14:00', '15:30')).toBe('오후 2:00 ~ 오후 3:30');
  expect(formatTimeRange('14:00', null)).toBe('오후 2:00');
  expect(formatTimeRange(null, null)).toBe('하루 종일');
});

test('날짜에 날 수를 더하고 빼며, 달과 해를 넘긴다', () => {
  expect(addDays('2026-10-16', 3)).toBe('2026-10-19');
  expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
  expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
});

test('월일 표시', () => {
  expect(formatMonthDay('2026-10-16')).toBe('10월 16일');
});
