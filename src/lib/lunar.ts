import KoreanLunarCalendar from 'korean-lunar-calendar';
import { DateKey, makeKey, parseKey } from './date';

export type LunarDate = { y: number; m: number; d: number; leap: boolean };

// 한국천문연구원 기준 표를 내장한 라이브러리. 양력 1000-02-13 ~ 2050-12-31만 바꿀 수 있다.
const cal = new KoreanLunarCalendar();

// 달력을 그릴 때 같은 날짜를 수없이 다시 바꾸게 되어서 결과를 기억해 둔다. 날짜 수가 많지 않아 지우지 않는다.
const toCache = new Map<DateKey, LunarDate | null>();
const fromCache = new Map<string, DateKey | null>();

export function toLunar(k: DateKey): LunarDate | null {
  if (toCache.has(k)) return toCache.get(k)!;
  const { y, m, d } = parseKey(k);
  let r: LunarDate | null = null;
  if (cal.setSolarDate(y, m, d)) {
    const l = cal.getLunarCalendar();
    r = { y: l.year, m: l.month, d: l.day, leap: !!l.intercalation };
  }
  toCache.set(k, r);
  return r;
}

// 그해 그 달이 29일까지면 30일은 29일로 옮긴다. 바꿀 수 없으면 null.
export function fromLunar(y: number, m: number, d: number, leap = false): DateKey | null {
  const key = `${y}-${m}-${d}-${leap}`;
  if (fromCache.has(key)) return fromCache.get(key)!;
  let r: DateKey | null = null;
  for (const day of d === 30 ? [30, 29] : [d]) {
    if (cal.setLunarDate(y, m, day, leap)) {
      const s = cal.getSolarCalendar();
      r = makeKey(s.year, s.month, s.day);
      break;
    }
  }
  fromCache.set(key, r);
  return r;
}

// 음력 반복을 고를 때 보여 주는 안내. 윤달 날짜는 다음 해부터 평달에 반복된다.
export function lunarRepeatLabel(k: DateKey): string | null {
  const l = toLunar(k);
  if (!l) return null;
  const base = `매년 음력 ${l.m}월 ${l.d}일에 반복돼요`;
  return l.leap ? `${base} (첫해는 윤${l.m}월 ${l.d}일)` : base;
}
