import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { DateKey, formatMonthDay, formatShort, formatTime, parseKey } from '../lib/date';
import type { Days } from '../lib/days';
import { DDay, ddayLabel } from '../lib/dday';
import { CalEvent, eventsOn } from '../lib/events';
import type { HolidayMap } from '../lib/holidayApi';
import { iconOf } from '../lib/icons';
import { decoratedCount, monthCells } from '../lib/monthCard';
import { ColorTheme, paletteFor } from '../theme/colors';

// 안드로이드 홈 화면 위젯. 네이티브 위젯 부품(FlexWidget, TextWidget)으로 그린다.
// 색은 고른 색 테마의 밝은 팔레트로 고정한다. 위젯은 폰의 다크 모드 전환에 맞춰 바로 다시 그려지지 않기 때문이다.

export type WidgetName = 'DDay' | 'Today' | 'Stickers';
export const WIDGET_NAMES: WidgetName[] = ['DDay', 'Today', 'Stickers'];

export type WidgetData = { events: CalEvent[]; ddays: DDay[]; days: Days; colorTheme: ColorTheme; holidays: HolidayMap };

type Hex = `#${string}`;
const colorsOf = (theme: ColorTheme) => {
  const p = paletteFor(theme, 'light');
  return { ...p, tints: p.tints } as unknown as Record<keyof typeof p, Hex> & { tints: Record<string, Hex> };
};

const TODAY_MAX = 2;
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

function DDayWidget({ data, today }: { data: WidgetData; today: DateKey }) {
  const c = colorsOf(data.colorTheme);
  const d = data.ddays[0];
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{ height: 'match_parent', width: 'match_parent', backgroundColor: c.accentSoft, borderRadius: 22, padding: 12, alignItems: 'center', justifyContent: 'center' }}
    >
      {d ? (
        <FlexWidget style={{ alignItems: 'center' }}>
          <TextWidget text={d.title} maxLines={1} truncate="END" style={{ fontSize: 13, color: c.muted }} />
          <TextWidget text={ddayLabel(d, today)} style={{ fontSize: 36, color: c.accentInk, fontWeight: 'bold' }} />
          <TextWidget text={formatMonthDay(d.date)} style={{ fontSize: 11, color: c.muted }} />
        </FlexWidget>
      ) : (
        <TextWidget text="디데이를 추가해 보세요" style={{ fontSize: 13, color: c.accentInk }} />
      )}
    </FlexWidget>
  );
}

function TodayWidget({ data, today }: { data: WidgetData; today: DateKey }) {
  const c = colorsOf(data.colorTheme);
  const list = eventsOn(data.events, today);
  const shown = list.slice(0, TODAY_MAX);
  const more = list.length - shown.length;
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `harujogak://calendar?day=${today}` }}
      style={{ height: 'match_parent', width: 'match_parent', backgroundColor: c.accentSoft, borderRadius: 22, padding: 12, flexGap: 6 }}
    >
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget text="오늘" style={{ fontSize: 15, color: c.accentInk, fontWeight: 'bold' }} />
        <TextWidget text={formatShort(today)} style={{ fontSize: 11, color: c.muted }} />
      </FlexWidget>
      {shown.length === 0 ? (
        <TextWidget text="오늘은 일정이 없어요" style={{ fontSize: 13, color: c.muted }} />
      ) : (
        shown.map((e) => (
          <FlexWidget
            key={e.id}
            style={{ width: 'match_parent', flexDirection: 'row', alignItems: 'center', flexGap: 8, backgroundColor: c.surface, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 9 }}
          >
            <FlexWidget style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c.tints[iconOf(e.icon).tint] }} />
            <TextWidget text={e.title} maxLines={1} truncate="END" style={{ fontSize: 13, color: c.fg }} />
            <TextWidget text={e.time ? formatTime(e.time) : '하루 종일'} style={{ fontSize: 11, color: c.muted }} />
          </FlexWidget>
        ))
      )}
      {more > 0 ? <TextWidget text={`+${more}개 더`} style={{ fontSize: 11, color: c.muted }} /> : null}
    </FlexWidget>
  );
}

function StickersWidget({ data, today }: { data: WidgetData; today: DateKey }) {
  const c = colorsOf(data.colorTheme);
  const { y, m } = parseKey(today);
  const cells = monthCells(y, m, data.days, data.holidays);
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const tone = { red: c.sun, blue: c.sat, normal: c.dim };
  const cell = (key: string, child: React.JSX.Element | null) => (
    <FlexWidget key={key} style={{ flex: 1, height: 'match_parent', alignItems: 'center', justifyContent: 'center' }}>
      {child}
    </FlexWidget>
  );
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'harujogak://calendar' }}
      style={{ height: 'match_parent', width: 'match_parent', backgroundColor: c.accentSoft, borderRadius: 22, padding: 12, flexGap: 8 }}
    >
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget text={`${m}월`} style={{ fontSize: 15, color: c.accentInk, fontWeight: 'bold' }} />
        <TextWidget text={`꾸민 날 ${decoratedCount(y, m, data.days)}일`} style={{ fontSize: 11, color: c.muted }} />
      </FlexWidget>
      <FlexWidget style={{ width: 'match_parent', flex: 1, backgroundColor: c.surface, borderRadius: 14, padding: 4 }}>
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row' }}>
          {WEEK.map((w) => cell(w, <TextWidget text={w} style={{ fontSize: 9, color: c.muted }} />))}
        </FlexWidget>
        {weeks.map((week, wi) => (
          <FlexWidget key={wi} style={{ width: 'match_parent', flex: 1, flexDirection: 'row' }}>
            {week.map((d, i) =>
              cell(
                d?.key ?? `e-${wi}-${i}`,
                d?.sticker ? (
                  <TextWidget text={d.sticker} style={{ fontSize: 15 }} />
                ) : d ? (
                  <TextWidget
                    text={String(d.day)}
                    style={{ fontSize: 10, color: d.key === today ? c.accentInk : tone[d.tone], fontWeight: d.key === today ? 'bold' : 'normal' }}
                  />
                ) : null,
              ),
            )}
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}

// 위젯 함수를 바로 불러 위젯 부품 트리를 돌려준다. 모르는 이름이면 디데이 위젯.
export function renderWidgetByName(name: string, data: WidgetData, today: DateKey): React.JSX.Element {
  const props = { data, today };
  if (name === 'Today') return TodayWidget(props);
  if (name === 'Stickers') return StickersWidget(props);
  return DDayWidget(props);
}
