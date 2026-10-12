import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ICON_GROUPS, ICON_KEYS, ICONS, IconKey } from '../lib/icons';
import { useTheme } from '../theme/ThemeProvider';
import { IconChip } from './IconChip';
import { FoldButton, Txt } from './ui';

const FOLDED = 6; // 접었을 때 한 줄에 보이는 개수.

// 아이콘이 많아서 처음에는 한 줄(고른 아이콘 + 자주 쓰는 아이콘)만 보여 주고, 펼치면 종류별로 모두 보여 준다.
export function IconPicker({ value, onChange }: { value: string; onChange: (k: IconKey) => void }) {
  const { c } = useTheme();
  const [open, setOpen] = useState(false);

  const item = (k: IconKey) => {
    const on = k === value;
    return (
      <Pressable
        key={k}
        accessibilityLabel={ICONS[k].label}
        accessibilityState={{ selected: on }}
        onPress={() => onChange(k)}
        style={{
          width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
          borderWidth: 1.5, borderColor: on ? c.accentInk : 'transparent', backgroundColor: on ? c.bg : 'transparent',
        }}
      >
        <IconChip icon={k} size={32} />
      </Pressable>
    );
  };
  const row = { flexDirection: 'row', flexWrap: 'wrap', gap: 6 } as const;
  // 앞쪽 아이콘(예전부터 있던 자주 쓰는 것)을 보여 주되, 고른 아이콘은 늘 맨 앞에 둔다.
  const folded = [value as IconKey, ...ICON_KEYS.filter((k) => k !== value)].filter((k) => k in ICONS).slice(0, FOLDED);

  return (
    <View style={{ gap: 6 }}>
      {open ? (
        <View style={{ gap: 10 }}>
          {ICON_GROUPS.map((g) => (
            <View key={g.label} style={{ gap: 4 }}>
              <Txt muted style={{ fontSize: 12 }}>{g.label}</Txt>
              <View style={row}>{g.keys.map(item)}</View>
            </View>
          ))}
        </View>
      ) : (
        <View style={row}>{folded.map(item)}</View>
      )}
      <FoldButton open={open} label="아이콘 더 보기" onPress={() => setOpen((v) => !v)} />
    </View>
  );
}
