import { DateKey, monthGrid, parseKey } from './date';
import type { Days } from './days';
import type { HolidayMap } from './holidayApi';
import { dayTone } from './holidays';

// 이달 돌아보기 카드의 한 칸. 달 밖의 칸은 null.
export type CardCell = { day: number; key: DateKey; sticker?: string; tone: 'red' | 'blue' | 'normal' } | null;

export function monthCells(y: number, m: number, days: Days, holidays: HolidayMap): CardCell[] {
  return monthGrid(y, m).map((key) => {
    if (!key) return null;
    const sticker = days[key]?.sticker;
    return { day: parseKey(key).d, key, ...(sticker ? { sticker } : {}), tone: dayTone(key, holidays) };
  });
}

export function decoratedCount(y: number, m: number, days: Days): number {
  const prefix = `${y}-${String(m).padStart(2, '0')}-`;
  return Object.entries(days).filter(([k, d]) => k.startsWith(prefix) && d.sticker).length;
}
