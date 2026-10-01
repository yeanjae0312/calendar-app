import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { addMinutes, DateKey, diffDays, formatDateChip, formatTime } from '../lib/date';
import { CalEvent, makeEvent } from '../lib/events';
import { iconOf, IconKey } from '../lib/icons';
import { newId } from '../lib/id';
import { useToday } from '../lib/useToday';
import { useAppData } from '../store/AppData';
import { useTheme } from '../theme/ThemeProvider';
import { IconChip } from './IconChip';
import { IconPicker } from './IconPicker';
import { InlineCalendar } from './InlineCalendar';
import { TimeWheel } from './TimeWheel';
import { Field, Label, MainButton, Sheet, ToggleRow, Txt } from './ui';

export type EventDraft = CalEvent | { date: DateKey };

type Panel = 'startDate' | 'startTime' | 'endDate' | 'endTime';

export function EventForm({ draft, onClose }: { draft: EventDraft; onClose: () => void }) {
  const { c } = useTheme();
  const { saveEvent, deleteEvent } = useAppData();
  const today = useToday();
  const existing = 'id' in draft ? draft : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [date, setDate] = useState<DateKey>(draft.date);
  const [endDate, setEndDate] = useState<DateKey>(existing?.endDate ?? draft.date);
  const [allDay, setAllDay] = useState(existing ? existing.time === null : true);
  const [time, setTime] = useState(existing?.time ?? '09:00');
  const [endTime, setEndTime] = useState(existing?.endTime ?? addMinutes(existing?.time ?? '09:00', 60));
  const [yearly, setYearly] = useState(existing?.yearly ?? false);
  const [icon, setIcon] = useState<IconKey>(existing?.icon ?? 'people');
  // 아이폰 캘린더처럼 달력과 휠 중 하나만 펼친다.
  const [open, setOpen] = useState<Panel | null>(null);

  const sameDay = endDate === date;
  const toggle = (p: Panel) => setOpen((o) => (o === p ? null : p));

  const changeAllDay = (v: boolean) => {
    setAllDay(v);
    if (v) setOpen((o) => (o === 'startTime' || o === 'endTime' ? null : o));
  };

  // 시작 날짜를 종료 날짜 뒤로 옮기면 종료 날짜도 따라간다.
  const changeStartDate = (k: DateKey) => {
    setDate(k);
    if (endDate < k) setEndDate(k);
  };

  // 같은 날이면 시작을 종료와 같거나 늦게 옮길 때 종료를 1시간 뒤로 민다.
  const changeStartTime = (t: string) => {
    setTime(t);
    if (sameDay && endTime <= t) setEndTime(addMinutes(t, 60));
  };

  // 같은 날이면 종료는 시작보다 늦어야 한다. 더 이르게 고르면 시작 5분 뒤로 맞춘다.
  const changeEndTime = (t: string) => setEndTime(!sameDay || t > time ? t : addMinutes(time, 5));

  const save = () => {
    const e = makeEvent({ id: existing?.id, title, date, endDate, allDay, time, endTime, icon, yearly }, newId);
    if (!e) return;
    saveEvent(e);
    onClose();
  };

  const remove = () => {
    if (!existing) return;
    Alert.alert('일정을 삭제할까요?', existing.title, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteEvent(existing.id);
          onClose();
        },
      },
    ]);
  };

  const chip = (label: string, text: string, p: Panel) => {
    const on = open === p;
    return (
      <Pressable
        accessibilityLabel={label}
        onPress={() => toggle(p)}
        accessibilityState={{ expanded: on }}
        style={{
          paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1.5,
          backgroundColor: on ? c.accentSoft : c.surface, borderColor: on ? c.accent : 'transparent',
        }}
      >
        <Txt style={{ fontSize: 14, color: on ? c.accentInk : c.fg }}>{text}</Txt>
      </Pressable>
    );
  };

  const divider = <View style={{ height: 1, backgroundColor: c.line }} />;
  const panel = (child: React.ReactNode) => <View style={{ paddingBottom: 10 }}>{child}</View>;
  const row = (label: string, chips: React.ReactNode) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
      <Txt>{label}</Txt>
      <View style={{ flexDirection: 'row', gap: 6 }}>{chips}</View>
    </View>
  );

  return (
    <Sheet onClose={onClose}>
      <Txt display style={{ fontSize: 20 }}>{existing ? '일정 수정' : '일정 추가'}</Txt>
      <Field left={<IconChip icon={icon} />} value={title} onChangeText={setTitle} placeholder="일정 제목" autoFocus={!existing} />

      <View style={{ backgroundColor: c.bg, borderRadius: 12, paddingHorizontal: 12 }}>
        <View style={{ paddingVertical: 6 }}>
          <ToggleRow label="하루 종일" value={allDay} onChange={changeAllDay} />
        </View>
        {divider}
        {row(
          '시작',
          <>
            {chip('시작 날짜', formatDateChip(date), 'startDate')}
            {allDay ? null : chip('시작 시간', formatTime(time), 'startTime')}
          </>,
        )}
        {open === 'startDate' ? panel(<InlineCalendar value={date} today={today} onChange={changeStartDate} />) : null}
        {open === 'startTime' && !allDay ? panel(<TimeWheel value={time} onChange={changeStartTime} />) : null}
        {divider}
        {row(
          '종료',
          <>
            {chip('종료 날짜', formatDateChip(endDate), 'endDate')}
            {allDay ? null : chip('종료 시간', formatTime(endTime), 'endTime')}
          </>,
        )}
        {open === 'endDate'
          ? panel(
              <>
                <InlineCalendar value={endDate} today={today} minDate={date} rangeFrom={date} onChange={setEndDate} />
                {sameDay ? null : (
                  <Txt style={{ fontSize: 12, color: c.accentInk, paddingHorizontal: 4, paddingTop: 4 }}>
                    {`${diffDays(date, endDate) + 1}일 동안`}
                  </Txt>
                )}
              </>,
            )
          : null}
        {open === 'endTime' && !allDay ? panel(<TimeWheel value={endTime} onChange={changeEndTime} />) : null}
      </View>

      <ToggleRow label="매년 반복" value={yearly} onChange={setYearly} />
      <Label>{`아이콘 · ${iconOf(icon).label}`}</Label>
      <IconPicker value={icon} onChange={setIcon} />
      <MainButton title="저장" onPress={save} disabled={!title.trim()} />
      {existing ? (
        <Pressable onPress={remove} style={{ alignItems: 'center', padding: 6 }}>
          <Txt style={{ color: c.sun }}>일정 삭제</Txt>
        </Pressable>
      ) : null}
    </Sheet>
  );
}
