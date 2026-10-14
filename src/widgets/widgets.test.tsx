import type { ReactElement } from 'react';
import type { CalEvent } from '../lib/events';
import { paletteFor } from '../theme/colors';
import { renderWidgetByName, type WidgetData } from './Widgets';

// 위젯 트리는 네이티브로 그려지므로, 트리 안의 글자와 누르기 동작만 꺼내서 확인한다.
type El = ReactElement<{ text?: string; children?: unknown; clickAction?: string; clickActionData?: { uri?: string }; style?: { backgroundColor?: string } }>;
const walk = (el: El | null, out: El[] = []): El[] => {
  if (!el || typeof el !== 'object') return out;
  out.push(el);
  const kids = el.props.children;
  (Array.isArray(kids) ? kids.flat(3) : [kids]).forEach((k) => walk(k as El, out));
  return out;
};
const texts = (el: El) => walk(el).map((e) => e.props.text).filter(Boolean);

const ev = (id: string, time: string | null, p: Partial<CalEvent> = {}): CalEvent =>
  ({ id, title: id, date: '2026-10-14', time, icon: 'cup', repeat: 'none', ...p });
const base: WidgetData = { events: [], ddays: [], days: {}, colorTheme: 'sky', holidays: { '2026-10-09': '한글날' } };
const today = '2026-10-14';

test('디데이 위젯은 첫 번째 디데이를 보여 주고, 누르면 앱을 연다', () => {
  const data = { ...base, ddays: [{ id: 'a', title: '우리 100일', date: '2026-11-04', countFrom: 1 as const }, { id: 'b', title: '두 번째', date: '2027-01-01', countFrom: 1 as const }] };
  const el = renderWidgetByName('DDay', data, today) as El;
  expect(texts(el)).toEqual(['우리 100일', 'D-21', '11월 4일']);
  expect(el.props.clickAction).toBe('OPEN_APP');
  expect(el.props.style?.backgroundColor).toBe(paletteFor('sky', 'light').accentSoft);
});

test('디데이가 없으면 안내를 보여 준다', () => {
  expect(texts(renderWidgetByName('DDay', base, today) as El)).toEqual(['디데이를 추가해 보세요']);
});

test('오늘 일정 위젯은 시간 순서로 둘까지 보여 주고 나머지는 +N개 더, 누르면 달력의 오늘', () => {
  const data = { ...base, events: [ev('저녁', '19:00'), ev('치과', '14:00'), ev('종일', null), ev('내일', null, { date: '2026-10-15' })] };
  const el = renderWidgetByName('Today', data, today) as El;
  expect(texts(el)).toEqual(['오늘', '10월 14일 수', '종일', '하루 종일', '치과', '오후 2:00', '+1개 더']);
  expect(el.props.clickActionData?.uri).toBe('harujogak://calendar?day=2026-10-14');
});

test('오늘 일정이 없으면 안내를 보여 준다', () => {
  expect(texts(renderWidgetByName('Today', base, today) as El)).toContain('오늘은 일정이 없어요');
});

test('스티커 위젯은 이번 달 스티커 달력과 꾸민 날 수를 보여 주고, 누르면 달력 화면', () => {
  const data = { ...base, days: { '2026-10-09': { sticker: '☀️' }, '2026-10-12': { sticker: '🍰' } } };
  const el = renderWidgetByName('Stickers', data, today) as El;
  const t = texts(el);
  expect(t.slice(0, 2)).toEqual(['10월', '꾸민 날 2일']);
  expect(t).toContain('☀️');
  expect(t).toContain('🍰');
  expect(t).not.toContain('9');
  expect(t).toContain('31');
  expect(el.props.clickActionData?.uri).toBe('harujogak://calendar');
});
