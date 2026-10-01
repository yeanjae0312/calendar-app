import Constants from 'expo-constants';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { DDayDraft, DDayForm } from '../src/components/DDayForm';
import { BackButton, Card, GhostButton, Label, Row, Screen, Segmented, Txt } from '../src/components/ui';
import { formatDot } from '../src/lib/date';
import { ddayLabel } from '../src/lib/dday';
import { useAppData } from '../src/store/AppData';
import type { ThemePref } from '../src/theme/colors';
import { useToday } from '../src/lib/useToday';
import { useTheme } from '../src/theme/ThemeProvider';

const THEMES: { value: ThemePref; label: string }[] = [
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' },
  { value: 'system', label: '시스템' },
];

export default function Settings() {
  const { pref, setPref } = useTheme();
  const { ddays } = useAppData();
  const today = useToday();
  const [draft, setDraft] = useState<DDayDraft | null>(null);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <BackButton />
        <Txt display style={{ fontSize: 22 }}>설정</Txt>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={{ gap: 12 }}>
        <Card>
          <Label>화면 테마</Label>
          <Segmented options={THEMES} value={pref} onChange={setPref} />
        </Card>
        <Card>
          <Label>디데이</Label>
          {ddays.map((d) => (
            <Row key={d.id} label={d.title} value={`${formatDot(d.date)} · ${ddayLabel(d, today)}`} onPress={() => setDraft(d)} />
          ))}
          <GhostButton title="+ 디데이 추가" onPress={() => setDraft({ date: today })} />
        </Card>
        <Txt muted style={{ textAlign: 'center', fontSize: 12 }}>{`슈수슈수 ${Constants.expoConfig?.version ?? ''}`}</Txt>
      </ScrollView>
      {draft ? <DDayForm draft={draft} onClose={() => setDraft(null)} /> : null}
    </Screen>
  );
}
