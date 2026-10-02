import { View } from 'react-native';
import { DateKey, formatDay } from '../lib/date';
import { CalEvent, coveringStart, dayLabel, eventsOn } from '../lib/events';
import { holidayName } from '../lib/holidays';
import { useHolidays } from '../store/Holidays';
import { useTheme } from '../theme/ThemeProvider';
import { EventRow } from './EventRow';
import { GhostButton, Sheet, Txt } from './ui';

type Props = {
  day: DateKey;
  events: CalEvent[];
  onClose: () => void;
  onAdd: () => void;
  onEdit: (e: CalEvent) => void;
};

export function DaySheet({ day, events, onClose, onAdd, onEdit }: Props) {
  const { c } = useTheme();
  const list = eventsOn(events, day);
  const holiday = holidayName(day, useHolidays());
  return (
    <Sheet onClose={onClose}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Txt display style={{ fontSize: 20 }}>{formatDay(day)}</Txt>
        {holiday ? <Txt style={{ fontSize: 13, color: c.sun }}>{holiday}</Txt> : null}
      </View>
      {list.length === 0 ? (
        <Txt muted>아직 일정이 없어요</Txt>
      ) : (
        list.map((e) => (
          <EventRow key={e.id} event={e} start={coveringStart(e, day) ?? e.date} badge={dayLabel(e, day)} onPress={() => onEdit(e)} />
        ))
      )}
      <GhostButton title="+ 이 날에 일정 추가" onPress={onAdd} />
    </Sheet>
  );
}
