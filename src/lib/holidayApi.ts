import type { DateKey } from './date';

export type HolidayMap = Record<DateKey, string>;
// 연도별로 받아 온 공휴일과 받은 시각.
export type HolidayCache = Record<string, { fetchedAt: number; days: HolidayMap }>;

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const URL = 'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';
const RENAME: Record<string, string> = { '1월1일': '신정', 기독탄신일: '성탄절' };

type Item = { locdate: number | string; dateName: string; isHoliday: string };
type Response = { response?: { header?: { resultCode?: string }; body?: { items?: { item?: Item | Item[] } | '' } } };

// 한국천문연구원 특일 정보 응답. 항목이 하나면 배열 대신 객체, 없으면 items가 빈 문자열로 온다.
export function parseRestDe(json: unknown): HolidayMap | null {
  const res = (json as Response | null)?.response;
  if (res?.header?.resultCode !== '00' || !res.body) return null;
  const raw = res.body.items ? res.body.items.item : undefined;
  const list = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  const out: HolidayMap = {};
  for (const it of list) {
    if (it.isHoliday !== 'Y') continue;
    const s = String(it.locdate);
    const k = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
    const name = RENAME[it.dateName] ?? it.dateName;
    out[k] = out[k] ? `${out[k]} · ${name}` : name;
  }
  return out;
}

// URLSearchParams는 React Native에서 불완전해서 주소를 직접 만든다.
export async function fetchYear(year: number, key: string, f: typeof fetch = fetch): Promise<HolidayMap | null> {
  const q = `serviceKey=${encodeURIComponent(key)}&solYear=${year}&numOfRows=100&_type=json`;
  try {
    const res = await f(`${URL}?${q}`);
    if (!res.ok) return null;
    // 키 오류는 JSON이 아니라 XML로 올 수 있다. 그러면 json()이 던진다.
    return parseRestDe(await res.json());
  } catch {
    return null;
  }
}

export const needsFetch = (cache: HolidayCache, year: number, now: number) => {
  const c = cache[year];
  return !c || now - c.fetchedAt > WEEK_MS;
};

// 받아 온 해는 번들 표 대신 쓴다. 비어 있는 해(아직 발표 전)는 번들 표를 남긴다.
export function mergeHolidays(bundled: HolidayMap, cache: HolidayCache): HolidayMap {
  const fetched = Object.entries(cache).filter(([, c]) => Object.keys(c.days).length > 0);
  const years = new Set(fetched.map(([y]) => y));
  const out: HolidayMap = Object.fromEntries(Object.entries(bundled).filter(([k]) => !years.has(k.slice(0, 4))));
  for (const [, c] of fetched) Object.assign(out, c.days);
  return out;
}
