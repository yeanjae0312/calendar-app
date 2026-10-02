export type DateKey = string;

const WD = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_MS = 86400000;

export const pad = (n: number) => String(n).padStart(2, '0');

export const makeKey = (y: number, m: number, d: number): DateKey => `${y}-${pad(m)}-${pad(d)}`;

export const toKey = (d: Date): DateKey => makeKey(d.getFullYear(), d.getMonth() + 1, d.getDate());

export function parseKey(k: DateKey) {
  const [y, m, d] = k.split('-').map(Number);
  return { y, m, d };
}

export function keyToDate(k: DateKey): Date {
  const { y, m, d } = parseKey(k);
  return new Date(y, m - 1, d);
}

// 주소 파라미터처럼 밖에서 들어온 값이 실제로 있는 날짜인지 확인한다.
export const isDateKey = (v: unknown): v is DateKey =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && toKey(keyToDate(v)) === v;

const utc = (k: DateKey) => {
  const { y, m, d } = parseKey(k);
  return Date.UTC(y, m - 1, d);
};

// UTC 자정끼리 빼서 서머타임과 시간대의 영향을 없앤다.
export const diffDays = (from: DateKey, to: DateKey) => Math.round((utc(to) - utc(from)) / DAY_MS);

export const weekday = (k: DateKey) => new Date(utc(k)).getUTCDay();

export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

export const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

export function monthGrid(y: number, m: number): (DateKey | null)[] {
  const cells: (DateKey | null)[] = Array(weekday(makeKey(y, m, 1))).fill(null);
  for (let d = 1; d <= daysInMonth(y, m); d++) cells.push(makeKey(y, m, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

export function addMonths(y: number, m: number, delta: number) {
  const t = y * 12 + (m - 1) + delta;
  return { y: Math.floor(t / 12), m: (((t % 12) + 12) % 12) + 1 };
}

export function formatDay(k: DateKey) {
  const { m, d } = parseKey(k);
  return `${m}월 ${d}일 ${WD[weekday(k)]}요일`;
}

export function formatShort(k: DateKey) {
  const { m, d } = parseKey(k);
  return `${m}월 ${d}일 ${WD[weekday(k)]}`;
}

export const formatDot = (k: DateKey) => k.split('-').join('.');

export function formatTime(t: string) {
  const [h, mm] = t.split(':').map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h < 12 ? '오전' : '오후'} ${h12}:${pad(mm)}`;
}

export const toHHMM = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function hhmmToDate(t: string): Date {
  const [h, m] = t.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function formatDateChip(k: DateKey) {
  const { y, m, d } = parseKey(k);
  return `${y}. ${m}. ${d}.`;
}

// 시간 휠의 세 칸: 오전(0)/오후(1), 1~12시, 5분 단위 분.
export type WheelTime = { ap: 0 | 1; h: number; m: number };

export function toWheel(t: string): WheelTime {
  const [h, m] = t.split(':').map(Number);
  return { ap: h < 12 ? 0 : 1, h: h % 12 || 12, m: Math.floor(m / 5) * 5 };
}

export function fromWheel(w: WheelTime): string {
  return `${pad((w.h % 12) + w.ap * 12)}:${pad(w.m)}`;
}

// 같은 날 안에서만 더한다. 23:55를 넘기면 23:55로 멈춘다.
export function addMinutes(t: string, mins: number): string {
  const [h, m] = t.split(':').map(Number);
  const total = Math.min(h * 60 + m + mins, 23 * 60 + 55);
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

export function formatTimeRange(time: string | null, endTime: string | null | undefined): string {
  if (!time) return '하루 종일';
  return endTime ? `${formatTime(time)} ~ ${formatTime(endTime)}` : formatTime(time);
}

export function addDays(k: DateKey, n: number): DateKey {
  const d = new Date(utc(k) + n * DAY_MS);
  return makeKey(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export function formatMonthDay(k: DateKey) {
  const { m, d } = parseKey(k);
  return `${m}월 ${d}일`;
}
