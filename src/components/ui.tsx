import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import {
  KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleProp, StyleSheet, Switch,
  Text, TextInput, TextInputProps, TextProps, useWindowDimensions, View, ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { F } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

export function Txt({ display, muted, style, ...rest }: TextProps & { display?: boolean; muted?: boolean }) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={[{ fontFamily: display ? F.display : F.body, color: muted ? c.muted : c.fg, fontSize: 15 }, style]}
    />
  );
}

export function Screen({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, gap: 12 }}>
      {children}
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return <View style={[{ backgroundColor: c.surface, borderRadius: 16, padding: 14, gap: 8 }, style]}>{children}</View>;
}

export function Label({ children }: { children: ReactNode }) {
  return <Txt muted style={{ fontSize: 12, letterSpacing: 0.5 }}>{children}</Txt>;
}

export function RoundButton({ label, onPress, children }: { label: string; onPress: () => void; children: ReactNode }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}
    >
      {children}
    </Pressable>
  );
}

export function MainButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      style={{ backgroundColor: c.accent, borderRadius: 14, paddingVertical: 14, alignItems: 'center', opacity: disabled ? 0.45 : 1 }}
    >
      <Txt display style={{ fontSize: 17, color: c.iconInk }}>{title}</Txt>
    </Pressable>
  );
}

export function GhostButton({ title, onPress }: { title: string; onPress: () => void }) {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ borderWidth: 1.5, borderStyle: 'dashed', borderColor: c.dim, borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}
    >
      <Txt muted style={{ fontSize: 14 }}>{title}</Txt>
    </Pressable>
  );
}

export function BackButton() {
  const { c } = useTheme();
  return (
    <Pressable accessibilityLabel="홈으로" onPress={() => router.back()} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialCommunityIcons name="chevron-left" size={22} color={c.muted} />
      <Txt muted>홈</Txt>
    </Pressable>
  );
}

export function Sheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const { height } = useWindowDimensions();
  const { c } = useTheme();
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable accessibilityLabel="닫기" style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} onPress={onClose} />
        {/* 화면 전체를 쓰는 Android에서도 키보드만큼 올라가도록 두 플랫폼 모두 padding을 쓴다. */}
        <KeyboardAvoidingView behavior="padding">
          <SafeAreaView
            edges={['bottom']}
            style={{ backgroundColor: c.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: height * 0.9 }}
          >
            <View style={{ alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: c.dim, marginTop: 10 }} />
            <ScrollView
              testID="sheet-scroll"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 16, gap: 12 }}
            >
              {children}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export function Field({ left, style, ...rest }: TextInputProps & { left?: ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: c.bg, borderRadius: 10, paddingHorizontal: 10 }}>
      {left}
      <TextInput
        placeholderTextColor={c.muted}
        maxLength={30}
        {...rest}
        style={[{ flex: 1, paddingVertical: 10, fontFamily: F.body, color: c.fg, fontSize: 15 }, style]}
      />
    </View>
  );
}

export function Row({ label, value, onPress }: { label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, gap: 12 }}
    >
      <Txt numberOfLines={1} style={{ flexShrink: 1 }}>{label}</Txt>
      <Txt muted style={{ fontSize: 14 }}>{value}</Txt>
    </Pressable>
  );
}

export function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Txt>{label}</Txt>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: c.accent, false: c.dim }}
        thumbColor={c.surface}
      />
    </View>
  );
}

export function Segmented<T extends string | number>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            onPress={() => onChange(o.value)}
            accessibilityState={{ selected: on }}
            style={{
              flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, alignItems: 'center',
              borderColor: on ? c.accent : c.line, backgroundColor: on ? c.accentSoft : 'transparent',
            }}
          >
            <Txt style={{ fontSize: 14, color: on ? c.accentInk : c.fg }}>{o.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
