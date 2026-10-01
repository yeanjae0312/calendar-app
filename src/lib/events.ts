import { addDays, DateKey, diffDays, formatMonthDay, formatShort, formatTime, formatTimeRange, isLeap, makeKey, parseKey } from './date';
import type { IconKey } from './icons';

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
  yearly: boolean;
};

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
  yearly: boolean;
};

// 시작일 뒤로 며칠 더 이어지는지. 하루 일정은 0.
export const spanDays = (e: CalEvent) => (e.endDate && e.endDate > e.date ? diffDays(e.date, e.endDate) : 0);

export const isMultiDay = (e: CalEvent) => spanDays(e) > 0;

// y년에 이 일정이 시작하는 날짜. 2월 29일 매년 일정은 평년에 2월 28일로 옮긴다.
export function occurrenceIn(e: CalEvent, y: number): DateKey | null {
  const o = parseKey(e.date);
  if (!e.yearly) return o.y === y ? e.date : null;
  if (y < o.y) return null;
  const d = o.m === 2 && o.d === 29 && !isLeap(y) ? 28 : o.d;
  return makeKey(y, o.m, d);
}

// 그날을 덮는 회차의 시작일. 연말에 시작해 연초까지 이어지는 매년 일정은 전년도 회차를 확인한다.
export function coveringStart(e: CalEvent, day: DateKey): DateKey | null {
  const span = spanDays(e);
  const y = parseKey(day).y;
  for (const yy of [y, y - 1]) {
    const s = occurrenceIn(e, yy);
    if (s && s <= day && day <= addDays(s, span)) return s;
  }
  return null;
}

// 하루 종일(null)을 빈 문자열로 두면 시간 있는 일정보다 앞에 온다.
const byTime = (a: CalEvent, b: CalEvent) => (a.time ?? '').localeCompare(b.time ?? '');

export function eventsOn(events: CalEvent[], day: DateKey): CalEvent[] {
  return events.filter((e) => coveringStart(e, day) !== null).sort(byTime);
}

export function countInMonth(events: CalEvent[], y: number, m: number): number {
  const first = makeKey(y, m, 1);
  const last = addDays(m === 12 ? makeKey(y + 1, 1, 1) : makeKey(y, m + 1, 1), -1);
  return events.filter((e) =>
    [y - 1, y].some((yy) => {
      const s = occurrenceIn(e, yy);
      return s !== null && s <= last && addDays(s, spanDays(e)) >= first;
    }),
  ).length;
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

function nextOccurrence(e: CalEvent, today: DateKey): DateKey | null {
  if (e.date > today) return e.date;
  if (!e.yearly) return null;
  const y = parseKey(today).y;
  for (const yy of [y, y + 1]) {
    const k = occurrenceIn(e, yy);
    if (k && k > today) return k;
  }
  return null;
}

export function upcoming(events: CalEvent[], today: DateKey, limit: number): Upcoming[] {
  return events
    .flatMap((event) => {
      const date = nextOccurrence(event, today);
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
    yearly: i.yearly,
  };
}
