import { HOLIDAYS } from '../data/holidays';
import { DateKey, weekday } from './date';

export const holidayName = (k: DateKey): string | undefined => HOLIDAYS[k];

export function dayTone(k: DateKey): 'red' | 'blue' | 'normal' {
  const w = weekday(k);
  if (w === 0 || HOLIDAYS[k]) return 'red';
  return w === 6 ? 'blue' : 'normal';
}
