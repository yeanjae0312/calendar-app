import { MEMO_MAX, STICKERS, toggleSticker, updateDay } from './days';

test('스티커는 40개이고 겹치지 않는다', () => {
  expect(STICKERS).toHaveLength(40);
  expect(new Set(STICKERS).size).toBe(40);
});

test('스티커를 붙이고, 같은 걸 다시 누르면 떼고, 다른 걸 누르면 바꾼다', () => {
  const a = toggleSticker({}, '2026-10-09', '☀️');
  expect(a).toEqual({ '2026-10-09': { sticker: '☀️' } });
  expect(toggleSticker(a, '2026-10-09', '🥰')).toEqual({ '2026-10-09': { sticker: '🥰' } });
  expect(toggleSticker(a, '2026-10-09', '☀️')).toEqual({});
});

test('메모는 앞뒤 공백을 지우고 40자에서 자르며, 비우면 지운다', () => {
  const a = updateDay({}, '2026-10-09', { memo: '  낮잠  ' });
  expect(a).toEqual({ '2026-10-09': { memo: '낮잠' } });
  expect(updateDay(a, '2026-10-09', { memo: 'ㄱ'.repeat(50) })['2026-10-09'].memo).toHaveLength(MEMO_MAX);
  expect(updateDay(a, '2026-10-09', { memo: '   ' })).toEqual({});
});

test('스티커와 메모 중 하나가 남으면 그 날짜는 남고, 다른 날짜는 그대로다', () => {
  const a = { '2026-10-09': { sticker: '☀️', memo: '낮잠' }, '2026-10-10': { sticker: '🥰' } };
  expect(toggleSticker(a, '2026-10-09', '☀️')).toEqual({ '2026-10-09': { memo: '낮잠' }, '2026-10-10': { sticker: '🥰' } });
  expect(updateDay(a, '2026-10-09', { memo: '' })).toEqual({ '2026-10-09': { sticker: '☀️' }, '2026-10-10': { sticker: '🥰' } });
});
