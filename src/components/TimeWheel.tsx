import WheelPicker from '@quidone/react-native-wheel-picker';
import { Pressable, View } from 'react-native';
import { fromWheel, pad, toWheel, WheelTime } from '../lib/date';
import { F } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { Txt } from './ui';

const AP = [{ value: 0, label: '오전' }, { value: 1, label: '오후' }];
const HOURS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
const MINUTES = Array.from({ length: 12 }, (_, i) => ({ value: i * 5, label: pad(i * 5) }));
const PRESETS: [string, string][] = [['오전 9시', '09:00'], ['낮 12시', '12:00'], ['오후 3시', '15:00'], ['오후 7시', '19:00']];

// 아이폰 캘린더처럼 창 안에 펼쳐지는 시간 휠. 오전/오후, 시, 5분 단위 분.
export function TimeWheel({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  const { c } = useTheme();
  const w = toWheel(value);
  const set = (patch: Partial<WheelTime>) => onChange(fromWheel({ ...w, ...patch }));
  const common = {
    itemHeight: 36,
    visibleItemCount: 5,
    width: '33%' as const,
    itemTextStyle: { fontFamily: F.body, fontSize: 18, color: c.fg },
    overlayItemStyle: { backgroundColor: c.accent, opacity: 0.18 },
  };

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {PRESETS.map(([label, t]) => (
          <Pressable
            key={t}
            onPress={() => onChange(t)}
            style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: c.surface }}
          >
            <Txt style={{ fontSize: 13 }}>{label}</Txt>
          </Pressable>
        ))}
      </View>
      {/* 휠 항목이 영역 위로 삐져나와 위쪽 칩의 터치를 막지 않게 잘라 낸다 (wheel-picker #62). */}
      <View testID="time-wheel" style={{ flexDirection: 'row', overflow: 'hidden' }}>
        <WheelPicker {...common} data={AP} value={w.ap} onValueChanged={({ item }) => set({ ap: item.value as 0 | 1 })} />
        <WheelPicker {...common} data={HOURS} value={w.h} onValueChanged={({ item }) => set({ h: item.value })} />
        <WheelPicker {...common} data={MINUTES} value={w.m} onValueChanged={({ item }) => set({ m: item.value })} />
      </View>
    </View>
  );
}
