import { DDay, ddayLabel, makeDDay } from './dday';

const d = (date: string, countFrom: 0 | 1 = 1): DDay => ({ id: 'x', title: '처음 만난 날', date, countFrom });
const today = '2026-10-30';

test('지난 날은 D+, 첫날을 1일로 세면 하루 더한다', () => {
  expect(ddayLabel(d('2025-08-15', 1), today)).toBe('D+442');
  expect(ddayLabel(d('2025-08-15', 0), today)).toBe('D+441');
});

test('앞으로 올 날은 D-이고, 세는 방식의 영향을 받지 않는다', () => {
  expect(ddayLabel(d('2026-12-12', 1), today)).toBe('D-43');
  expect(ddayLabel(d('2026-12-12', 0), today)).toBe('D-43');
});

test('당일은 D-Day', () => {
  expect(ddayLabel(d(today, 1), today)).toBe('D-Day');
  expect(ddayLabel(d(today, 0), today)).toBe('D-Day');
});

test('makeDDay는 제목 공백을 지우고, 빈 제목이면 만들지 않는다', () => {
  expect(makeDDay({ title: ' 시험 ', date: '2026-12-12', countFrom: 1 }, () => 'n'))
    .toEqual({ id: 'n', title: '시험', date: '2026-12-12', countFrom: 1 });
  expect(makeDDay({ title: ' ', date: '2026-12-12', countFrom: 1 }, () => 'n')).toBeNull();
  expect(makeDDay({ id: 'old', title: '시험', date: '2026-12-12', countFrom: 0 }, () => 'n')?.id).toBe('old');
});
