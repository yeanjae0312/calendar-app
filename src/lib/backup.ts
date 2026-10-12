import type { DateKey } from './date';
import { Days, MEMO_MAX, updateDay } from './days';
import type { DDay } from './dday';
import { CalEvent, isRepeat, normalizeEvent, StoredEvent } from './events';

const APP = 'shusushusu';
// 2부터 하루 꾸미기(days)가 들어간다. 1은 꾸미기 없이 읽는다.
const VERSION = 2;

export type Backup = { app: typeof APP; version: typeof VERSION; exportedAt: string; events: CalEvent[]; ddays: DDay[]; days: Days };
export type ParsedBackup = { ok: true; events: CalEvent[]; ddays: DDay[]; days: Days } | { ok: false; error: string };

export const makeBackup = (events: CalEvent[], ddays: DDay[], days: Days, now: Date): Backup => ({
  app: APP,
  version: VERSION,
  exportedAt: now.toISOString(),
  events,
  ddays,
  days,
});

export const backupFileName = (today: DateKey) => `슈수슈수-백업-${today}.json`;

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null;
const isStr = (v: unknown): v is string => typeof v === 'string';
const isKey = (v: unknown) => isStr(v) && /^\d{4}-\d{2}-\d{2}$/.test(v);

// 화면이 깨지지 않을 만큼만 확인한다. 아이콘 이름이 낯설면 화면에서 기본 아이콘으로 보인다.
const isEvent = (e: unknown) =>
  isRec(e) && isStr(e.id) && isStr(e.title) && isKey(e.date) && isStr(e.icon) &&
  (e.time === null || isStr(e.time)) && (e.endDate === undefined || isKey(e.endDate)) &&
  (e.repeat === undefined || isRepeat(e.repeat)) && (e.yearly === undefined || typeof e.yearly === 'boolean');
const isDeco = (d: unknown) =>
  isRec(d) && (d.sticker === undefined || (isStr(d.sticker) && d.sticker.length <= 16)) &&
  (d.memo === undefined || (isStr(d.memo) && d.memo.length <= MEMO_MAX));
// 예전 백업에는 꾸미기가 없다.
const isDays = (v: unknown) => v === undefined || (isRec(v) && !Array.isArray(v) && Object.entries(v).every(([k, d]) => isKey(k) && isDeco(d)));
const isDDay = (d: unknown) =>
  isRec(d) && isStr(d.id) && isStr(d.title) && isKey(d.date) && (d.countFrom === 0 || d.countFrom === 1);

// 빈 항목은 버리고 메모 공백을 정리한다. 앱에서 저장할 때와 같은 규칙이다.
const cleanDays = (days: Days): Days => Object.entries(days).reduce<Days>((acc, [k, d]) => updateDay(acc, k, d), {});

export function parseBackup(text: string): ParsedBackup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: '파일을 읽을 수 없어요. JSON 형식이 아니에요.' };
  }
  if (!isRec(data) || data.app !== APP) return { ok: false, error: '슈수슈수 백업 파일이 아니에요.' };
  if (data.version !== 1 && data.version !== VERSION) return { ok: false, error: '새 버전 앱에서 만든 백업이에요. 앱을 업데이트해 주세요.' };
  const { events, ddays, days } = data;
  if (!Array.isArray(events) || !Array.isArray(ddays) || !events.every(isEvent) || !ddays.every(isDDay) || !isDays(days)) {
    return { ok: false, error: '백업 파일 내용이 손상됐어요.' };
  }
  return { ok: true, events: (events as StoredEvent[]).map(normalizeEvent), ddays: ddays as DDay[], days: cleanDays((days ?? {}) as Days) };
}
