import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// 네이티브 파일 입출력만 둔다. 형식 판단은 backup.ts에 있다.
export async function shareBackup(name: string, json: string): Promise<void> {
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();
  file.create();
  file.write(json);
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: '백업 저장' });
}

// 안드로이드 파일 앱은 .json을 다른 형식으로 알려 주기도 해서, 모든 파일을 고를 수 있게 하고 내용으로 확인한다.
export async function pickBackupText(): Promise<string | null> {
  const r = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
  if (r.canceled) return null;
  return new File(r.assets[0].uri).text();
}
