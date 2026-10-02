import { HOLIDAYS } from '../data/holidays';
import { DateKey, weekday } from './date';
import type { HolidayMap } from './holidayApi';

export const holidayName = (k: DateKey, map: HolidayMap = HOLIDAYS): string | undefined => map[k];

export function dayTone(k: DateKey, map: HolidayMap = HOLIDAYS): 'red' | 'blue' | 'normal' {
  const w = weekday(k);
  if (w === 0 || map[k]) return 'red';
  return w === 6 ? 'blue' : 'normal';
}
