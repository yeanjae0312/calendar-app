import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { DDayCarousel } from '../src/components/DDayCarousel';
import { EventRow } from '../src/components/EventRow';
import { Card, Label, MainButton, RoundButton, Screen, Txt } from '../src/components/ui';
import { formatShort, parseKey } from '../src/lib/date';
import { countInMonth, coveringStart, dayLabel, eventsOn, upcoming } from '../src/lib/events';
import { useAppData } from '../src/store/AppData';
import { useToday } from '../src/lib/useToday';
import { useTheme } from '../src/theme/ThemeProvider';

export default function Home() {
  const { c } = useTheme();
  const { events, ddays } = useAppData();
  const today = useToday();
  const { y, m } = parseKey(today);
  const todays = eventsOn(events, today);
  const next = upcoming(events, today, 3);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Txt display style={{ fontSize: 24, color: c.accentInk }}>슈수슈수</Txt>
        <RoundButton label="설정" onPress={() => router.push('/settings')}>
          <MaterialCommunityIcons name="cog-outline" size={20} color={c.muted} />
        </RoundButton>
      </View>
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        <DDayCarousel ddays={ddays} today={today} />
        <Card>
          <Label>{`오늘 · ${formatShort(today)}`}</Label>
          {todays.length === 0 ? <Txt muted>오늘은 일정이 없어요</Txt> : todays.map((e) => (
              <EventRow key={e.id} event={e} start={coveringStart(e, today) ?? e.date} badge={dayLabel(e, today)} />
            ))}
        </Card>
        <Card>
          <Label>다가오는 일정</Label>
          {next.length === 0 ? (
            <Txt muted>예정된 일정이 없어요</Txt>
          ) : (
            next.map((u) => <EventRow key={u.event.id} event={u.event} start={u.date} showDate right={`D-${u.daysLeft}`} />)
          )}
        </Card>
        <Card style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <Txt muted>{`${m}월 일정`}</Txt>
          <Txt display style={{ fontSize: 26 }}>{String(countInMonth(events, y, m))}</Txt>
          <Txt muted>개</Txt>
        </Card>
      </ScrollView>
      <MainButton title="캘린더 보기" onPress={() => router.push('/calendar')} />
    </Screen>
  );
}
