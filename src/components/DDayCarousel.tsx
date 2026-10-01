import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { DateKey, formatDot } from '../lib/date';
import { DDay, ddayLabel } from '../lib/dday';
import { useTheme } from '../theme/ThemeProvider';
import { Txt } from './ui';

export function DDayCarousel({ ddays, today }: { ddays: DDay[]; today: DateKey }) {
  const { c } = useTheme();
  const [w, setW] = useState(0);
  const [page, setPage] = useState(0);

  if (ddays.length === 0) {
    return (
      <Pressable
        onPress={() => router.push('/settings')}
        style={{ backgroundColor: c.accentSoft, borderRadius: 22, padding: 20, alignItems: 'center', gap: 4 }}
      >
        <Txt display style={{ fontSize: 20, color: c.accentInk }}>디데이를 추가해 보세요</Txt>
        <Txt muted style={{ fontSize: 13 }}>설정에서 기억하고 싶은 날을 등록할 수 있어요</Txt>
      </Pressable>
    );
  }

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ backgroundColor: c.accentSoft, borderRadius: 22, paddingVertical: 16 }}>
      {w > 0 ? (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / w))}
        >
          {ddays.map((d) => (
            <View key={d.id} style={{ width: w, alignItems: 'center', gap: 2 }}>
              <Txt muted style={{ fontSize: 13 }}>{d.title}</Txt>
              <Txt display style={{ fontSize: 44, color: c.accentInk }}>{ddayLabel(d, today)}</Txt>
              <Txt muted style={{ fontSize: 12 }}>{`${formatDot(d.date)} · 첫날을 ${d.countFrom}일로`}</Txt>
            </View>
          ))}
        </ScrollView>
      ) : null}
      {ddays.length > 1 ? (
        <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center', marginTop: 8 }}>
          {ddays.map((d, i) => (
            <View
              key={d.id}
              style={{ width: i === page ? 12 : 5, height: 5, borderRadius: 3, backgroundColor: i === page ? c.accentInk : c.dim }}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
