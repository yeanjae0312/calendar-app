import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { DateKey, formatDay } from '../lib/date';
import { DayDeco, MEMO_MAX, STICKERS, STICKERS_FOLDED } from '../lib/days';
import { CalEvent, coveringStart, dayLabel, eventsOn } from '../lib/events';
import { holidayName } from '../lib/holidays';
import { useHolidays } from '../store/Holidays';
import { useTheme } from '../theme/ThemeProvider';
import { Emoji } from './Emoji';
import { EventRow } from './EventRow';
import { Field, FoldButton, GhostButton, Label, Sheet, Txt } from './ui';

type Props = {
  day: DateKey;
  events: CalEvent[];
  onClose: () => void;
  onAdd: () => void;
  onEdit: (e: CalEvent) => void;
  deco?: DayDeco;
  onToggleSticker?: (sticker: string) => void;
  onMemo?: (memo: string) => void;
};

export function DaySheet({ day, events, onClose, onAdd, onEdit, deco, onToggleSticker, onMemo }: Props) {
  const { c } = useTheme();
  const list = eventsOn(events, day);
  const holiday = holidayName(day, useHolidays());
  // 메모는 창 안에 따로 들고, 입력을 마치거나 창이 닫힐 때 저장한다. 글자마다 저장하면 달력 전체를 다시 그려서 입력이 끊긴다.
  const [memo, setMemo] = useState(deco?.memo ?? '');
  // 고른 스티커가 접힌 줄 뒤에 있으면 처음부터 펼쳐 보여 준다.
  const [allStickers, setAllStickers] = useState(() => STICKERS.indexOf(deco?.sticker as (typeof STICKERS)[number]) >= STICKERS_FOLDED);
  const memoRef = useRef(memo);
  const saveRef = useRef(onMemo);
  useEffect(() => {
    saveRef.current = onMemo;
  });
  useEffect(() => () => saveRef.current?.(memoRef.current), []);
  return (
    <Sheet onClose={onClose}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Txt display style={{ fontSize: 20 }}>{formatDay(day)}</Txt>
        {holiday ? <Txt style={{ fontSize: 13, color: c.sun }}>{holiday}</Txt> : null}
      </View>
      <Label>오늘의 스티커</Label>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {(allStickers ? STICKERS : STICKERS.slice(0, STICKERS_FOLDED)).map((s) => {
          const on = deco?.sticker === s;
          return (
            <Pressable
              key={s}
              accessibilityLabel={`스티커 ${s}`}
              accessibilityState={{ selected: on }}
              onPress={() => onToggleSticker?.(s)}
              style={{
                width: '10%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1.5,
                borderColor: on ? c.accent : 'transparent', backgroundColor: on ? c.accentSoft : 'transparent',
              }}
            >
              <Emoji size={20}>{s}</Emoji>
            </Pressable>
          );
        })}
      </View>
      <FoldButton open={allStickers} label="스티커 더 보기" onPress={() => setAllStickers((v) => !v)} />
      <Field
        value={memo}
        onChangeText={(t) => {
          setMemo(t);
          memoRef.current = t;
        }}
        onBlur={() => onMemo?.(memoRef.current)}
        placeholder="한 줄 메모"
        maxLength={MEMO_MAX}
      />
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
