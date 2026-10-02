import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { DDayDraft, DDayForm } from '../src/components/DDayForm';
import { BackButton, Card, GhostButton, Label, Row, Screen, Segmented, Txt } from '../src/components/ui';
import { backupFileName, makeBackup, parseBackup } from '../src/lib/backup';
import { pickBackupText, shareBackup } from '../src/lib/backupFile';
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
  const { events, ddays, replaceAll } = useAppData();
  const today = useToday();
  const [draft, setDraft] = useState<DDayDraft | null>(null);

  const exportBackup = async () => {
    try {
      await shareBackup(backupFileName(today), JSON.stringify(makeBackup(events, ddays, new Date()), null, 2));
    } catch {
      Alert.alert('백업을 만들지 못했어요', '잠시 후 다시 시도해 주세요.');
    }
  };

  const importBackup = async () => {
    let text: string | null;
    try {
      text = await pickBackupText();
    } catch {
      Alert.alert('파일을 열지 못했어요', '다른 파일로 다시 시도해 주세요.');
      return;
    }
    if (text == null) return;
    const r = parseBackup(text);
    if (!r.ok) {
      Alert.alert('가져오지 못했어요', r.error);
      return;
    }
    Alert.alert('백업으로 바꿀까요?', `일정 ${r.events.length}개, 디데이 ${r.ddays.length}개로 바뀌어요. 지금 있는 일정과 디데이는 지워져요.`, [
      { text: '취소', style: 'cancel' },
      { text: '바꾸기', style: 'destructive', onPress: () => replaceAll(r.events, r.ddays) },
    ]);
  };

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
        <Card>
          <Label>백업</Label>
          <Row label="백업 내보내기" value="파일로 저장" onPress={exportBackup} />
          <Row label="백업 가져오기" value="파일에서 되살리기" onPress={importBackup} />
        </Card>
        <Txt muted style={{ textAlign: 'center', fontSize: 12 }}>{`슈수슈수 ${Constants.expoConfig?.version ?? ''}`}</Txt>
      </ScrollView>
      {draft ? <DDayForm draft={draft} onClose={() => setDraft(null)} /> : null}
    </Screen>
  );
}
