import { DateKey, diffDays } from './date';

export type DDay = { id: string; title: string; date: DateKey; countFrom: 0 | 1 };
export type DDayInput = { id?: string; title: string; date: DateKey; countFrom: 0 | 1 };

// countFrom은 지난 날(D+)을 셀 때만 쓴다. 당일은 어느 방식이든 D-Day다.
export function ddayLabel(x: DDay, today: DateKey): string {
  const n = diffDays(x.date, today);
  if (n === 0) return 'D-Day';
  return n > 0 ? `D+${n + x.countFrom}` : `D-${-n}`;
}

export function makeDDay(i: DDayInput, id: () => string): DDay | null {
  const title = i.title.trim();
  return title ? { id: i.id ?? id(), title, date: i.date, countFrom: i.countFrom } : null;
}
