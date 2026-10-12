import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { DateKey, monthGrid, parseKey } from '../lib/date';
import type { Days } from '../lib/days';
import { CalEvent, eventsOn, isMultiDay } from '../lib/events';
import { dayTone } from '../lib/holidays';
import { useHolidays } from '../store/Holidays';
import { iconOf } from '../lib/icons';
import { Segment, weekSegments } from '../lib/weekLayout';
import { useTheme } from '../theme/ThemeProvider';
import { Emoji } from './Emoji';
import { IconChip } from './IconChip';
import { Txt } from './ui';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const COL = 100 / 7;
const NUM_H = 26;
const BAR_H = 14;
const BAR_STEP = BAR_H + 2;
const LANES = 2; // 한 칸에 보여 줄 막대 층 수. 넘치면 "+N".
const MAX_ICONS = 3; // 더 보여 줄 게 있으면 하나를 "+N" 자리로 쓴다.
const CELL_H = NUM_H + LANES * BAR_STEP + 20;

type Props = {
  y: number;
  m: number;
  events: CalEvent[];
  today: DateKey;
  selected: DateKey | null;
  onPressDay: (k: DateKey) => void;
  days?: Days;
  // 달을 넘길 때 날짜 칸에만 줄 움직임. 카드와 요일 줄은 제자리에 있다.
  bodyStyle?: ComponentProps<typeof Animated.View>['style'];
};

export function MonthGrid({ y, m, events, today, selected, onPressDay, bodyStyle, days }: Props) {
  const { c } = useTheme();
  const holidays = useHolidays();
  const grid = monthGrid(y, m);
  const weeks = Array.from({ length: grid.length / 7 }, (_, i) => grid.slice(i * 7, i * 7 + 7));

  const bar = (s: Segment) => {
    const i = iconOf(s.event.icon);
    return (
      <View
        key={s.event.id}
        style={{
          position: 'absolute', top: NUM_H + s.lane * BAR_STEP, height: BAR_H,
          left: `${s.startCol * COL}%`, width: `${(s.endCol - s.startCol + 1) * COL}%`,
          paddingLeft: s.contLeft ? 0 : 2, paddingRight: s.contRight ? 0 : 2,
        }}
      >
        <View
          style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 3, overflow: 'hidden',
            backgroundColor: c.tints[i.tint],
            borderTopLeftRadius: s.contLeft ? 0 : 4, borderBottomLeftRadius: s.contLeft ? 0 : 4,
            borderTopRightRadius: s.contRight ? 0 : 4, borderBottomRightRadius: s.contRight ? 0 : 4,
          }}
        >
          <MaterialCommunityIcons name={i.glyph} size={9} color={c.iconInk} />
          <Txt numberOfLines={1} style={{ flex: 1, fontSize: 9, lineHeight: BAR_H, color: c.iconInk }}>
            {s.event.title}
          </Txt>
        </View>
      </View>
    );
  };

  return (
    <View testID="month-card" style={{ backgroundColor: c.surface, borderRadius: 18, padding: 6, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
        {WEEK.map((w, i) => (
          <Txt key={w} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: i === 0 ? c.sun : i === 6 ? c.sat : c.muted }}>
            {w}
          </Txt>
        ))}
      </View>
      <Animated.View testID="month-body" style={bodyStyle}>
      {weeks.map((week, wi) => {
        const segs = weekSegments(events, week);
        return (
          <View key={wi} style={{ flexDirection: 'row', height: CELL_H, borderTopWidth: 1, borderTopColor: c.line }}>
            {week.map((k, col) => {
              if (!k) return <View key={`empty-${col}`} style={{ width: `${COL}%` }} />;
              const all = eventsOn(events, k);
              const singles = all.filter((e) => !isMultiDay(e));
              const hiddenBars = segs.filter((s) => s.lane >= LANES && s.startCol <= col && s.endCol >= col).length;
              const shown = singles.length <= MAX_ICONS && hiddenBars === 0 ? singles.length : MAX_ICONS - 1;
              const more = hiddenBars + Math.max(0, singles.length - shown);
              const tone = dayTone(k, holidays);
              const isToday = k === today;
              const sticker = days?.[k]?.sticker;
              return (
                <Pressable
                  key={k}
                  accessibilityLabel={`${parseKey(k).d}일, 일정 ${all.length}개`}
                  onPress={() => onPressDay(k)}
                  style={{ width: `${COL}%`, alignItems: 'center', borderRadius: 8, backgroundColor: k === selected ? c.accentSoft : 'transparent' }}
                >
                  <View style={{ height: NUM_H, justifyContent: 'center' }}>
                    <View
                      style={{
                        width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isToday ? c.accent : 'transparent',
                      }}
                    >
                      <Txt style={{ fontSize: 13, color: isToday ? c.iconInk : tone === 'red' ? c.sun : tone === 'blue' ? c.sat : c.fg }}>
                        {parseKey(k).d}
                      </Txt>
                    </View>
                  </View>
                  {/* 하루 꾸미기 스티커는 일정과 상관없이 늘 칸 오른쪽 위에 둔다.
                      좁은 폰에서 날짜 동그라미와 살짝 겹쳐도 가려지지 않게 위에 그리고, 글자 크기 설정으로 커지지 않게 한다. */}
                  {sticker ? (
                    <Emoji testID={`sticker-${k}`} size={10} style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                      {sticker}
                    </Emoji>
                  ) : null}
                  <View style={{ height: LANES * BAR_STEP }} />
                  {/* 좁은 칸에서도 한 줄에 들어가도록 줄바꿈하지 않는다. 아이콘 셋, 또는 둘과 "+N". */}
                  <View
                    testID={`icons-${k}`}
                    style={{ flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', gap: 1, overflow: 'hidden' }}
                  >
                    {singles.slice(0, shown).map((e) => (
                      <IconChip key={e.id} icon={e.icon} size={12} />
                    ))}
                    {more > 0 ? <Txt muted style={{ fontSize: 9, lineHeight: 13 }}>{`+${more}`}</Txt> : null}
                  </View>
                </Pressable>
              );
            })}
            <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              {segs.filter((s) => s.lane < LANES).map(bar)}
            </View>
          </View>
        );
      })}
      </Animated.View>
    </View>
  );
}
