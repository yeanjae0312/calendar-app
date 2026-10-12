import type { DateKey } from './date';

// 그날 창에 10개씩 줄지어 보인다. 처음 두 줄은 자주 쓰는 기분·날씨·활동이고, 나머지는 더 보기로 펼친다.
// 순서를 바꿔도 저장된 스티커에는 영향이 없지만, 앞 20개는 접힌 상태에서 바로 보이는 자리라 함부로 바꾸지 않는다.
export const STICKERS = [
  '🥰', '😊', '🙂', '😐', '😢', '😡', '😴', '🤒', '☀️', '🌧️',
  '🍰', '☕', '🍜', '🏃', '📚', '🎮', '🎬', '✈️', '🛍️', '💪',
  '🤩', '😎', '🥳', '😭', '😤', '🤯', '🥱', '🤗', '❄️', '🌈',
  '🍕', '🍺', '🍣', '🎂', '🎵', '🎨', '💼', '💐', '🐶', '🐱',
] as const;

export const STICKERS_FOLDED = 20;

export const MEMO_MAX = 40;

export type DayDeco = { sticker?: string; memo?: string };
export type Days = Record<DateKey, DayDeco>;

// 그날 꾸미기를 바꾼다. 메모는 앞뒤 공백을 지우고 40자에서 자른다. 스티커와 메모가 다 비면 그 날짜를 지운다.
export function updateDay(days: Days, k: DateKey, patch: DayDeco): Days {
  const next: DayDeco = { ...days[k], ...patch };
  if ('memo' in patch) next.memo = patch.memo?.trim().slice(0, MEMO_MAX);
  const deco: DayDeco = {};
  if (next.sticker) deco.sticker = next.sticker;
  if (next.memo) deco.memo = next.memo;
  const { [k]: _old, ...rest } = days;
  return deco.sticker || deco.memo ? { ...rest, [k]: deco } : rest;
}

// 같은 스티커를 다시 누르면 떼고, 다른 스티커면 바꿔 붙인다.
export const toggleSticker = (days: Days, k: DateKey, s: string): Days =>
  updateDay(days, k, { sticker: days[k]?.sticker === s ? undefined : s });
