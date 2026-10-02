import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { addMonths, DateKey, monthGrid, parseKey } from '../lib/date';
import { dayTone } from '../lib/holidays';
import { useHolidays } from '../store/Holidays';
import { useTheme } from '../theme/ThemeProvider';
import { Txt } from './ui';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const CELL = { width: '14.2857%', height: 34, alignItems: 'center', justifyContent: 'center' } as const;

type Props = {
  value: DateKey;
  today: DateKey;
  onChange: (k: DateKey) => void;
  // 이보다 이른 날짜는 누를 수 없다. 종료 날짜를 고를 때 시작 날짜를 넣는다.
  minDate?: DateKey;
  // 이 날짜부터 value까지를 연하게 칠한다.
  rangeFrom?: DateKey;
};

// 일정 추가 창 안에 펼쳐지는 작은 달력. 팝업 대신 쓴다.
export function InlineCalendar({ value, today, onChange, minDate, rangeFrom }: Props) {
  const { c } = useTheme();
  const holidays = useHolidays();
  const v = parseKey(value);
  const [ym, setYm] = useState({ y: v.y, m: v.m });
  const move = (delta: number) => setYm((p) => addMonths(p.y, p.m, delta));

  const arrow = (label: string, name: 'chevron-left' | 'chevron-right', delta: number) => (
    <Pressable
      accessibilityLabel={label}
      onPress={() => move(delta)}
      hitSlop={6}
      style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}
    >
      <MaterialCommunityIcons name={name} size={18} color={c.muted} />
    </Pressable>
  );

  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 }}>
        <Txt display style={{ fontSize: 16 }}>{`${ym.y}년 ${ym.m}월`}</Txt>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {arrow('이전 달', 'chevron-left', -1)}
          {arrow('다음 달', 'chevron-right', 1)}
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {WEEK.map((w, i) => (
          <Txt key={w} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: i === 0 ? c.sun : i === 6 ? c.sat : c.muted }}>
            {w}
          </Txt>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {monthGrid(ym.y, ym.m).map((k, i) => {
          if (!k) return <View key={`empty-${i}`} style={CELL} />;
          const d = parseKey(k).d;
          const hasRange = !!rangeFrom && rangeFrom < value;
          const isRangeStart = hasRange && k === rangeFrom;
          const selected = k === value || isRangeStart;
          const disabled = !!minDate && k < minDate;
          const tone = dayTone(k, holidays);
          // 기간 띠: 가운데 날은 꽉 채우고, 시작 날은 오른쪽 반, 끝 날은 왼쪽 반만 칠한다.
          const band = !hasRange
            ? null
            : k > rangeFrom! && k < value
              ? { left: 0, right: 0 }
              : isRangeStart
                ? { left: '50%' as const, right: 0 }
                : k === value
                  ? { left: 0, right: '50%' as const }
                  : null;
          return (
            <Pressable
              key={k}
              accessibilityLabel={`${ym.m}월 ${d}일`}
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() => onChange(k)}
              style={[CELL, disabled && { opacity: 0.3 }]}
            >
              {band ? <View style={{ position: 'absolute', top: 2, bottom: 2, backgroundColor: c.accentSoft, ...band }} /> : null}
              <View
                style={{
                  width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: selected ? c.accent : 'transparent',
                  borderWidth: k === today && !selected ? 1.5 : 0, borderColor: c.accent,
                }}
              >
                <Txt
                  style={{
                    fontSize: 13,
                    color: selected ? c.iconInk : tone === 'red' ? c.sun : tone === 'blue' ? c.sat : c.fg,
                  }}
                >
                  {d}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
