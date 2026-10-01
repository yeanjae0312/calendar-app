import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { DaySheet } from '../src/components/DaySheet';
import { EventDraft, EventForm } from '../src/components/EventForm';
import { MonthGrid } from '../src/components/MonthGrid';
import { BackButton, RoundButton, Screen, Txt } from '../src/components/ui';
import { addMonths, DateKey, makeKey, parseKey } from '../src/lib/date';
import { useAppData } from '../src/store/AppData';
import { useToday } from '../src/lib/useToday';
import { useTheme } from '../src/theme/ThemeProvider';

export default function CalendarScreen() {
  const { c } = useTheme();
  const { events } = useAppData();
  const today = useToday();
  const t = parseKey(today);
  const [ym, setYm] = useState({ y: t.y, m: t.m });
  const [day, setDay] = useState<DateKey | null>(null);
  const [draft, setDraft] = useState<EventDraft | null>(null);

  const move = (delta: number) => setYm((p) => addMonths(p.y, p.m, delta));
  const addDate = ym.y === t.y && ym.m === t.m ? today : makeKey(ym.y, ym.m, 1);
  const openForm = (d: EventDraft) => {
    setDay(null);
    setDraft(d);
  };

  return (
    <Screen>
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
      <MonthGrid y={ym.y} m={ym.m} events={events} today={today} selected={day} onPressDay={setDay} />
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
