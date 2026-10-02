import { addDays, addMonths, DateKey, daysInMonth, diffDays, formatMonthDay, formatShort, formatTime, formatTimeRange, makeKey, parseKey } from './date';
import type { IconKey } from './icons';

export type Repeat = 'none' | 'weekly' | 'monthly' | 'yearly';

export const REPEAT_LABEL: Record<Repeat, string> = { none: '안 함', weekly: '매주', monthly: '매월', yearly: '매년' };

export type CalEvent = {
  id: string;
  title: string;
  date: DateKey;
  // 여러 날 일정의 마지막 날. 하루 일정과 예전 데이터에는 없다.
  endDate?: DateKey;
  time: string | null;
  // 예전에 저장한 일정에는 없을 수 있다.
  endTime?: string | null;
  icon: IconKey;
  repeat: Repeat;
};

// 예전에 저장한 일정은 repeat 대신 yearly를 가진다.
export type StoredEvent = Omit<CalEvent, 'repeat'> & { repeat?: Repeat; yearly?: boolean };

export const isRepeat = (v: unknown): v is Repeat => typeof v === 'string' && Object.prototype.hasOwnProperty.call(REPEAT_LABEL, v);

// 모르는 반복 값은 반복 안 함으로 둔다.
export function normalizeEvent({ yearly, ...rest }: StoredEvent): CalEvent {
  const repeat = isRepeat(rest.repeat) ? rest.repeat : yearly === true ? 'yearly' : 'none';
  return { ...rest, repeat };
}

export type Upcoming = { event: CalEvent; date: DateKey; daysLeft: number };

export type EventInput = {
  id?: string;
  title: string;
  date: DateKey;
  endDate?: DateKey;
  allDay: boolean;
  time: string;
  endTime: string;
  icon: IconKey;
  repeat: Repeat;
};

// 시작일 뒤로 며칠 더 이어지는지. 하루 일정은 0.
export const spanDays = (e: CalEvent) => (e.endDate && e.endDate > e.date ? diffDays(e.date, e.endDate) : 0);

export const isMultiDay = (e: CalEvent) => spanDays(e) > 0;

// n번째(0부터) 회차의 시작일. 그 달에 없는 날짜(31일, 2월 29일)는 말일로 옮긴다.
function nth(e: CalEvent, n: number): DateKey {
  if (e.repeat === 'weekly') return addDays(e.date, 7 * n);
  if (e.repeat === 'monthly' || e.repeat === 'yearly') {
    const o = parseKey(e.date);
    const { y, m } = addMonths(o.y, o.m, e.repeat === 'monthly' ? n : 12 * n);
    return makeKey(y, m, Math.min(o.d, daysInMonth(y, m)));
  }
  return e.date;
}

// 그날이나 그 전에 시작한 마지막 회차의 번호. 첫 회차 전이면 null.
function indexOnOrBefore(e: CalEvent, day: DateKey): number | null {
  if (day < e.date) return null;
  if (e.repeat === 'none') return 0;
  const o = parseKey(e.date);
  const d = parseKey(day);
  let n =
    e.repeat === 'weekly' ? Math.floor(diffDays(e.date, day) / 7)
    : e.repeat === 'monthly' ? (d.y - o.y) * 12 + (d.m - o.m)
    : d.y - o.y;
  while (n > 0 && nth(e, n) > day) n--;
  return n;
}

export function latestStart(e: CalEvent, day: DateKey): DateKey | null {
  const n = indexOnOrBefore(e, day);
  return n === null ? null : nth(e, n);
}

export function nextStart(e: CalEvent, today: DateKey): DateKey | null {
  if (e.date > today) return e.date;
  if (e.repeat === 'none') return null;
  return nth(e, indexOnOrBefore(e, today)! + 1);
}

// 그날을 덮는 회차의 시작일. 회차 길이가 모두 같아서 가장 최근 회차만 보면 된다.
export function coveringStart(e: CalEvent, day: DateKey): DateKey | null {
  const s = latestStart(e, day);
  return s && day <= addDays(s, spanDays(e)) ? s : null;
}

// 하루 종일(null)을 빈 문자열로 두면 시간 있는 일정보다 앞에 온다.
const byTime = (a: CalEvent, b: CalEvent) => (a.time ?? '').localeCompare(b.time ?? '');

export function eventsOn(events: CalEvent[], day: DateKey): CalEvent[] {
  return events.filter((e) => coveringStart(e, day) !== null).sort(byTime);
}

export function countInMonth(events: CalEvent[], y: number, m: number): number {
  const first = makeKey(y, m, 1);
  const last = makeKey(y, m, daysInMonth(y, m));
  return events.filter((e) => {
    const s = latestStart(e, last);
    return s !== null && addDays(s, spanDays(e)) >= first;
  }).length;
}

export function dayLabel(e: CalEvent, day: DateKey): string | null {
  const s = coveringStart(e, day);
  if (!s || !isMultiDay(e)) return null;
  const n = diffDays(s, day) + 1;
  if (n === 1) return '첫날';
  return n === spanDays(e) + 1 ? '마지막 날' : `${n}일째`;
}

// 목록에 보여 줄 "언제" 한 줄. start는 보여 줄 회차의 시작일이다.
export function describeWhen(e: CalEvent, start: DateKey = e.date, withDate = false): string {
  if (!isMultiDay(e)) {
    const range = formatTimeRange(e.time, e.endTime);
    return withDate ? `${formatShort(start)} · ${range}` : range;
  }
  const end = addDays(start, spanDays(e));
  if (!e.time) return `${formatMonthDay(start)} ~ ${formatMonthDay(end)} · 하루 종일`;
  const endPart = e.endTime ? `${formatMonthDay(end)} ${formatTime(e.endTime)}` : formatMonthDay(end);
  return `${formatMonthDay(start)} ${formatTime(e.time)} ~ ${endPart}`;
}

export function upcoming(events: CalEvent[], today: DateKey, limit: number): Upcoming[] {
  return events
    .flatMap((event) => {
      const date = nextStart(event, today);
      return date ? [{ event, date, daysLeft: diffDays(today, date) }] : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date) || byTime(a.event, b.event))
    .slice(0, limit);
}

export function makeEvent(i: EventInput, id: () => string): CalEvent | null {
  const title = i.title.trim();
  if (!title) return null;
  const multi = !!i.endDate && i.endDate > i.date;
  const time = i.allDay ? null : i.time;
  // 같은 날이면 종료가 시작보다 늦어야 한다. 여러 날이면 종료 시간은 마지막 날의 시간이다.
  const endTime = time && (multi || i.endTime > time) ? i.endTime : null;
  return {
    id: i.id ?? id(),
    title,
    date: i.date,
    ...(multi ? { endDate: i.endDate } : {}),
    time,
    endTime,
    icon: i.icon,
    repeat: i.repeat,
  };
}
