import type { DateKey } from './date';
import type { DDay } from './dday';
import { CalEvent, isRepeat, normalizeEvent, StoredEvent } from './events';

const APP = 'shusushusu';
const VERSION = 1;

export type Backup = { app: typeof APP; version: typeof VERSION; exportedAt: string; events: CalEvent[]; ddays: DDay[] };
export type ParsedBackup = { ok: true; events: CalEvent[]; ddays: DDay[] } | { ok: false; error: string };

export const makeBackup = (events: CalEvent[], ddays: DDay[], now: Date): Backup => ({
  app: APP,
  version: VERSION,
  exportedAt: now.toISOString(),
  events,
  ddays,
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
const isDDay = (d: unknown) =>
  isRec(d) && isStr(d.id) && isStr(d.title) && isKey(d.date) && (d.countFrom === 0 || d.countFrom === 1);

export function parseBackup(text: string): ParsedBackup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: '파일을 읽을 수 없어요. JSON 형식이 아니에요.' };
  }
  if (!isRec(data) || data.app !== APP) return { ok: false, error: '슈수슈수 백업 파일이 아니에요.' };
  if (data.version !== VERSION) return { ok: false, error: '새 버전 앱에서 만든 백업이에요. 앱을 업데이트해 주세요.' };
  const { events, ddays } = data;
  if (!Array.isArray(events) || !Array.isArray(ddays) || !events.every(isEvent) || !ddays.every(isDDay)) {
    return { ok: false, error: '백업 파일 내용이 손상됐어요.' };
  }
  return { ok: true, events: (events as StoredEvent[]).map(normalizeEvent), ddays: ddays as DDay[] };
}
