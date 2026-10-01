import { Pressable, View } from 'react-native';
import { ICON_KEYS, ICONS, IconKey } from '../lib/icons';
import { useTheme } from '../theme/ThemeProvider';
import { IconChip } from './IconChip';

export function IconPicker({ value, onChange }: { value: string; onChange: (k: IconKey) => void }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {ICON_KEYS.map((k) => {
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
      })}
    </View>
  );
}
