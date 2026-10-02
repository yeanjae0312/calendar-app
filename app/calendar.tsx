import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { PanResponder, Pressable, View } from 'react-native';
import { DaySheet } from '../src/components/DaySheet';
import { EventDraft, EventForm } from '../src/components/EventForm';
import { MonthGrid } from '../src/components/MonthGrid';
import { BackButton, RoundButton, Screen, Txt } from '../src/components/ui';
import { addMonths, DateKey, isDateKey, makeKey, parseKey } from '../src/lib/date';
import { swipeMonth } from '../src/lib/swipe';
import { useAppData } from '../src/store/AppData';
import { useToday } from '../src/lib/useToday';
import { useTheme } from '../src/theme/ThemeProvider';

export default function CalendarScreen() {
  const { c } = useTheme();
  const { events } = useAppData();
  const today = useToday();
  const t = parseKey(today);
  const params = useLocalSearchParams<{ day?: string }>();
  // 홈에서 일정을 눌러 들어오면 그날을 바로 연다.
  const initial = isDateKey(params.day) ? params.day : null;
  const [ym, setYm] = useState(() => {
    const p = parseKey(initial ?? today);
    return { y: p.y, m: p.m };
  });
  const [day, setDay] = useState<DateKey | null>(initial);
  const [draft, setDraft] = useState<EventDraft | null>(null);

  const move = (delta: number) => setYm((p) => addMonths(p.y, p.m, delta));
  // 달력을 좌우로 밀면 이전 달과 다음 달로 넘긴다. 날짜 칸 누르기는 그대로 둔다.
  const swipe = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 15 && Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderRelease: (_, g) => {
          const d = swipeMonth(g.dx, g.dy);
          if (d) setYm((p) => addMonths(p.y, p.m, d));
        },
      }),
    [],
  );
  const addDate = ym.y === t.y && ym.m === t.m ? today : makeKey(ym.y, ym.m, 1);
  const openForm = (d: EventDraft) => {
    setDay(null);
    setDraft(d);
  };

  return (
    <Screen>
      {/* iOS 26부터는 화면 어디서든 밀면 뒤로 간다. 달력 넘기기를 먼저 받도록 가장자리에서 밀 때만 뒤로 가게 한다. */}
      <Stack.Screen options={{ fullScreenGestureEnabled: false }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackButton />
        <Txt display style={{ fontSize: 22 }}>
          {`${ym.m}월 `}
          <Txt muted style={{ fontSize: 13 }}>{ym.y}</Txt>
        </Txt>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <RoundButton label="이전 달" onPress={() => move(-1)}>
            <MaterialCommunityIcons name="chevron-left" size={20} color={c.muted} />
          </RoundButton>
          <RoundButton label="다음 달" onPress={() => move(1)}>
            <MaterialCommunityIcons name="chevron-right" size={20} color={c.muted} />
          </RoundButton>
        </View>
      </View>
      <View {...swipe.panHandlers}>
        <MonthGrid y={ym.y} m={ym.m} events={events} today={today} selected={day} onPressDay={setDay} />
      </View>
      <View style={{ flex: 1 }} />
      <Pressable
        accessibilityLabel="일정 추가"
        onPress={() => openForm({ date: addDate })}
        style={{
          alignSelf: 'flex-end', width: 56, height: 56, borderRadius: 28, backgroundColor: c.accent,
          alignItems: 'center', justifyContent: 'center', elevation: 4,
        }}
      >
        <MaterialCommunityIcons name="plus" size={28} color={c.iconInk} />
      </Pressable>
      {day ? (
        <DaySheet day={day} events={events} onClose={() => setDay(null)} onAdd={() => openForm({ date: day })} onEdit={(e) => openForm(e)} />
      ) : null}
      {draft ? <EventForm draft={draft} onClose={() => setDraft(null)} /> : null}
    </Screen>
  );
}
