import { backupFileName, makeBackup, parseBackup } from './backup';
import type { CalEvent } from './events';

const ev: CalEvent = { id: 'a', title: '치과', date: '2026-10-02', time: '14:00', endTime: null, icon: 'hospital', repeat: 'monthly' };
const dd = { id: 'd', title: '100일', date: '2026-07-01', countFrom: 1 as const };

test('내보낸 백업을 그대로 다시 읽는다', () => {
  const text = JSON.stringify(makeBackup([ev], [dd], new Date('2026-10-01T00:00:00Z')));
  expect(parseBackup(text)).toEqual({ ok: true, events: [ev], ddays: [dd] });
});

test('파일 이름에 날짜가 들어간다', () => expect(backupFileName('2026-10-01')).toBe('슈수슈수-백업-2026-10-01.json'));

test('예전 형식 일정(yearly)도 읽는다', () => {
  const { repeat: _r, ...old } = ev;
  const r = parseBackup(JSON.stringify({ app: 'shusushusu', version: 1, events: [{ ...old, yearly: true }], ddays: [] }));
  expect(r).toEqual({ ok: true, events: [{ ...old, repeat: 'yearly' }], ddays: [] });
});

test.each([
  ['not json', 'JSON'],
  [JSON.stringify({ hello: 1 }), '슈수슈수 백업 파일이 아니에요'],
  [JSON.stringify(null), '슈수슈수 백업 파일이 아니에요'],
  [JSON.stringify({ app: 'shusushusu', version: 2, events: [], ddays: [] }), '새 버전'],
  [JSON.stringify({ app: 'shusushusu', version: 1, events: {}, ddays: [] }), '손상'],
  [JSON.stringify({ app: 'shusushusu', version: 1, events: [{ id: 'a' }], ddays: [] }), '손상'],
  [JSON.stringify({ app: 'shusushusu', version: 1, events: [null], ddays: [] }), '손상'],
  [JSON.stringify({ app: 'shusushusu', version: 1, events: [], ddays: [{ id: 'd', title: 'x', date: '2026-1-1', countFrom: 1 }] }), '손상'],
])('잘못된 파일은 이유와 함께 거절한다 %#', (text, msg) => {
  const r = parseBackup(text);
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.error).toContain(msg);
});

test.each([
  [{ repeat: 'daily' }],
  [{ repeat: 3 }],
  [{ repeat: 'toString' }],
  [{ yearly: 'false' }],
])('반복 값이 잘못된 일정이 든 백업은 거절한다 %#', (bad) => {
  const r = parseBackup(JSON.stringify({ app: 'shusushusu', version: 1, events: [{ ...ev, ...bad }], ddays: [] }));
  expect(r).toEqual({ ok: false, error: '백업 파일 내용이 손상됐어요.' });
});
