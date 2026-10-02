import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { DateKey, monthGrid, parseKey } from '../lib/date';
import { CalEvent, eventsOn, isMultiDay } from '../lib/events';
import { dayTone } from '../lib/holidays';
import { useHolidays } from '../store/Holidays';
import { iconOf } from '../lib/icons';
import { Segment, weekSegments } from '../lib/weekLayout';
import { useTheme } from '../theme/ThemeProvider';
import { IconChip } from './IconChip';
import { Txt } from './ui';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const COL = 100 / 7;
const NUM_H = 26;
const BAR_H = 14;
const BAR_STEP = BAR_H + 2;
const LANES = 2; // 한 칸에 보여 줄 막대 층 수. 넘치면 "+N".
const MAX_ICONS = 3;
const CELL_H = NUM_H + LANES * BAR_STEP + 20;

type Props = {
  y: number;
  m: number;
  events: CalEvent[];
  today: DateKey;
  selected: DateKey | null;
  onPressDay: (k: DateKey) => void;
};

export function MonthGrid({ y, m, events, today, selected, onPressDay }: Props) {
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
    <View style={{ backgroundColor: c.surface, borderRadius: 18, padding: 6 }}>
      <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
        {WEEK.map((w, i) => (
          <Txt key={w} style={{ flex: 1, textAlign: 'center', fontSize: 12, color: i === 0 ? c.sun : i === 6 ? c.sat : c.muted }}>
            {w}
          </Txt>
        ))}
      </View>
      {weeks.map((week, wi) => {
        const segs = weekSegments(events, week);
        return (
          <View key={wi} style={{ flexDirection: 'row', height: CELL_H, borderTopWidth: 1, borderTopColor: c.line }}>
            {week.map((k, col) => {
              if (!k) return <View key={`empty-${col}`} style={{ width: `${COL}%` }} />;
              const all = eventsOn(events, k);
              const singles = all.filter((e) => !isMultiDay(e));
              const hiddenBars = segs.filter((s) => s.lane >= LANES && s.startCol <= col && s.endCol >= col).length;
              const more = hiddenBars + Math.max(0, singles.length - MAX_ICONS);
              const tone = dayTone(k, holidays);
              const isToday = k === today;
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
                  <View style={{ height: LANES * BAR_STEP }} />
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 1, maxWidth: 34 }}>
                    {singles.slice(0, MAX_ICONS).map((e) => (
                      <IconChip key={e.id} icon={e.icon} size={13} />
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
    </View>
  );
}
