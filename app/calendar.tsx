import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, PanResponder, Pressable, useWindowDimensions, View } from 'react-native';
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
  // dir은 새 달이 들어올 방향이다. 1이면 오른쪽에서, -1이면 왼쪽에서, 0이면 바로 보인다.
  const [ym, setYm] = useState(() => {
    const p = parseKey(initial ?? today);
    return { y: p.y, m: p.m, dir: 0 };
  });
  const [day, setDay] = useState<DateKey | null>(initial);
  const [draft, setDraft] = useState<EventDraft | null>(null);

  const { width } = useWindowDimensions();
  const [tx] = useState(() => new Animated.Value(0));

  // 지금 달을 d 방향으로 밀어 내보낸 뒤 달을 바꾼다. next가 없으면 바로 옆 달.
  const slide = useCallback(
    (d: -1 | 1, next?: { y: number; m: number }) => {
      Animated.timing(tx, { toValue: -d * width, duration: 160, useNativeDriver: true }).start(() => {
        setYm((p) => ({ ...(next ?? addMonths(p.y, p.m, d)), dir: d }));
      });
    },
    [tx, width],
  );

  // 새 달이 그려진 뒤 반대쪽에서 들어온다. 그리는 동안 달력은 화면 밖에 있어서 깜빡이지 않는다.
  useEffect(() => {
    if (!ym.dir) return;
    tx.setValue(ym.dir * width);
    Animated.timing(tx, { toValue: 0, duration: 160, useNativeDriver: true }).start();
  }, [ym, tx, width]);

  // 달력을 좌우로 밀면 손가락을 따라오다가 이전 달과 다음 달로 넘어간다. 날짜 칸 누르기는 그대로 둔다.
  const swipe = useMemo(() => {
    const back = () => Animated.spring(tx, { toValue: 0, useNativeDriver: true }).start();
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 15 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => tx.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        const d = swipeMonth(g.dx, g.dy);
        if (d) slide(d);
        else back();
      },
      onPanResponderTerminate: back,
    });
  }, [tx, slide]);

  const isThisMonth = ym.y === t.y && ym.m === t.m;
  const toThisMonth = () => slide((ym.y - t.y) * 12 + (ym.m - t.m) > 0 ? -1 : 1, { y: t.y, m: t.m });
  const addDate = isThisMonth ? today : makeKey(ym.y, ym.m, 1);
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
          {isThisMonth ? null : (
            <RoundButton label="이번 달로" onPress={toThisMonth}>
              <MaterialCommunityIcons name="calendar-today" size={18} color={c.accentInk} />
            </RoundButton>
          )}
          <RoundButton label="이전 달" onPress={() => slide(-1)}>
            <MaterialCommunityIcons name="chevron-left" size={20} color={c.muted} />
          </RoundButton>
          <RoundButton label="다음 달" onPress={() => slide(1)}>
            <MaterialCommunityIcons name="chevron-right" size={20} color={c.muted} />
          </RoundButton>
        </View>
      </View>
      <View style={{ overflow: 'hidden' }} {...swipe.panHandlers}>
        <Animated.View style={{ transform: [{ translateX: tx }] }}>
          <MonthGrid y={ym.y} m={ym.m} events={events} today={today} selected={day} onPressDay={setDay} />
        </Animated.View>
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
