import { decoratedCount, monthCells } from './monthCard';

const days = { '2026-10-09': { sticker: '☀️' }, '2026-10-12': { memo: '메모만' }, '2026-11-01': { sticker: '🥰' } };
const holidays = { '2026-10-09': '한글날' };

test('1일이 목요일인 달은 앞에 빈칸 넷, 날짜마다 스티커와 색을 담는다', () => {
  const cells = monthCells(2026, 10, days, holidays);
  expect(cells.slice(0, 4)).toEqual([null, null, null, null]);
  expect(cells[4]).toEqual({ day: 1, key: '2026-10-01', tone: 'normal' });
  expect(cells[4 + 8]).toEqual({ day: 9, key: '2026-10-09', sticker: '☀️', tone: 'red' });
  expect(cells[4 + 9]).toMatchObject({ day: 10, tone: 'blue' });
  expect(cells.filter(Boolean)).toHaveLength(31);
});

test('1일이 일요일인 달은 빈칸 없이 시작한다', () => {
  expect(monthCells(2026, 11, days, holidays)[0]).toEqual({ day: 1, key: '2026-11-01', sticker: '🥰', tone: 'red' });
});

test('꾸민 날 수는 그달에 스티커를 붙인 날만 센다', () => {
  expect(decoratedCount(2026, 10, days)).toBe(1);
  expect(decoratedCount(2026, 12, days)).toBe(0);
});
