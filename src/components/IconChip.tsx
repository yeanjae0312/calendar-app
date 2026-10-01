import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { iconOf } from '../lib/icons';
import { useTheme } from '../theme/ThemeProvider';

export function IconChip({ icon, size = 22 }: { icon: string; size?: number }) {
  const { c } = useTheme();
  const i = iconOf(icon);
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2, backgroundColor: c.tints[i.tint],
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <MaterialCommunityIcons name={i.glyph} size={Math.round(size * 0.62)} color={c.iconInk} />
    </View>
  );
}
