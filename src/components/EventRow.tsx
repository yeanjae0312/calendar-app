import { Pressable, View } from 'react-native';
import type { DateKey } from '../lib/date';
import { CalEvent, describeWhen } from '../lib/events';
import { useTheme } from '../theme/ThemeProvider';
import { IconChip } from './IconChip';
import { Txt } from './ui';

type Props = {
  event: CalEvent;
  // 보여 줄 회차의 시작일. 매년 반복 일정은 올해 날짜를 넣는다.
  start?: DateKey;
  // 하루 일정에도 날짜를 붙인다 (다가오는 일정 목록).
  showDate?: boolean;
  // "3일째" 같은 작은 배지.
  badge?: string | null;
  right?: string;
  onPress?: () => void;
};

export function EventRow({ event, start, showDate, badge, right, onPress }: Props) {
  const { c } = useTheme();
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
      <IconChip icon={event.icon} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt numberOfLines={1}>
          {event.title}
          {event.yearly ? <Txt muted style={{ fontSize: 12 }}>{'  매년'}</Txt> : null}
        </Txt>
        <Txt muted style={{ fontSize: 12 }}>{describeWhen(event, start ?? event.date, showDate)}</Txt>
      </View>
      {badge ? (
        <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: c.accentSoft }}>
          <Txt style={{ fontSize: 11, color: c.accentInk }}>{badge}</Txt>
        </View>
      ) : null}
      {right ? <Txt display style={{ color: c.accentInk, fontSize: 17 }}>{right}</Txt> : null}
    </Pressable>
  );
}
