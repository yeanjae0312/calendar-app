import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { DateKey, formatDay, keyToDate, toKey } from '../lib/date';
import { DDay, ddayLabel, makeDDay } from '../lib/dday';
import { newId } from '../lib/id';
import { useAppData } from '../store/AppData';
import { useTheme } from '../theme/ThemeProvider';
import { Field, Label, MainButton, Row, Segmented, Sheet, Txt } from './ui';

export type DDayDraft = DDay | { date: DateKey };

export function DDayForm({ draft, onClose }: { draft: DDayDraft; onClose: () => void }) {
  const { c } = useTheme();
  const { saveDDay, deleteDDay } = useAppData();
  const existing = 'id' in draft ? draft : null;
  const today = toKey(new Date());

  const [title, setTitle] = useState(existing?.title ?? '');
  const [date, setDate] = useState<DateKey>(draft.date);
  const [countFrom, setCountFrom] = useState<0 | 1>(existing?.countFrom ?? 1);
  const [picking, setPicking] = useState(false);

  const save = () => {
    const d = makeDDay({ id: existing?.id, title, date, countFrom }, newId);
    if (!d) return;
    saveDDay(d);
    onClose();
  };

  const remove = () => {
    if (!existing) return;
    Alert.alert('디데이를 삭제할까요?', existing.title, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          deleteDDay(existing.id);
          onClose();
        },
      },
    ]);
  };

  const onPicked = (ev: DateTimePickerEvent, d?: Date) => {
    setPicking(false);
    if (ev.type === 'set' && d) setDate(toKey(d));
  };

  return (
    <Sheet onClose={onClose}>
      <Txt display style={{ fontSize: 20 }}>{existing ? '디데이 수정' : '디데이 추가'}</Txt>
      <Field value={title} onChangeText={setTitle} placeholder="예: 처음 만난 날" autoFocus={!existing} />
      <Row label="날짜" value={formatDay(date)} onPress={() => setPicking(true)} />
      <Label>지난 날을 셀 때 첫날을</Label>
      <Segmented<0 | 1>
        options={[{ value: 1, label: '1일로 세기' }, { value: 0, label: '0일로 세기' }]}
        value={countFrom}
        onChange={setCountFrom}
      />
      <Txt muted style={{ fontSize: 13 }}>{`오늘 기준 ${ddayLabel({ id: '', title, date, countFrom }, today)}`}</Txt>
      <MainButton title="저장" onPress={save} disabled={!title.trim()} />
      {existing ? (
        <Pressable onPress={remove} style={{ alignItems: 'center', padding: 6 }}>
          <Txt style={{ color: c.sun }}>디데이 삭제</Txt>
        </Pressable>
      ) : null}
      {picking ? <DateTimePicker value={keyToDate(date)} mode="date" onChange={onPicked} /> : null}
    </Sheet>
  );
}
