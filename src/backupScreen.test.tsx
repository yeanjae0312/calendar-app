import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Alert, AlertButton } from 'react-native';
import RootLayout from '../app/_layout';
import Settings from '../app/settings';
import { pickBackupText, shareBackup } from './lib/backupFile';

jest.mock('./lib/backupFile', () => ({ shareBackup: jest.fn(async () => {}), pickBackupText: jest.fn() }));

const old = { id: 'old', title: '옛 일정', date: '2026-10-02', time: null, icon: 'people', repeat: 'none' };
const fresh = { id: 'n', title: '새 일정', date: '2026-10-03', time: null, icon: 'people', repeat: 'none' };
const stored = async () => JSON.parse((await AsyncStorage.getItem('events')) ?? '[]');

// renderRouter는 같은 파일 안에서 앞 테스트의 화면을 기억해서, 설정 화면 흐름을 한 테스트에 이어서 확인한다.
test('백업을 내보내고, 잘못된 파일은 거절하고, 올바른 파일은 확인 후 통째로 바꾼다', async () => {
  await AsyncStorage.setItem('events', JSON.stringify([old]));
  const alert = jest.spyOn(Alert, 'alert');
  await renderRouter({ _layout: RootLayout, settings: Settings }, { initialUrl: '/settings' });

  await fireEvent.press(await screen.findByText('백업 내보내기'));
  await waitFor(() => expect(shareBackup).toHaveBeenCalled());
  const [name, json] = (shareBackup as jest.Mock).mock.calls[0];
  expect(name).toMatch(/^슈수슈수-백업-\d{4}-\d{2}-\d{2}\.json$/);
  expect(JSON.parse(json)).toMatchObject({ app: 'shusushusu', events: [old] });

  (pickBackupText as jest.Mock).mockResolvedValueOnce('{"hello":1}');
  await fireEvent.press(screen.getByText('백업 가져오기'));
  await waitFor(() => expect(alert).toHaveBeenCalledWith('가져오지 못했어요', '슈수슈수 백업 파일이 아니에요.'));
  expect(await stored()).toEqual([old]);

  (pickBackupText as jest.Mock).mockResolvedValueOnce(JSON.stringify({ app: 'shusushusu', version: 1, events: [fresh], ddays: [] }));
  await fireEvent.press(screen.getByText('백업 가져오기'));
  await waitFor(() => expect(alert).toHaveBeenLastCalledWith('백업으로 바꿀까요?', expect.any(String), expect.any(Array)));
  const buttons = alert.mock.calls.at(-1)![2] as AlertButton[];
  expect(await stored()).toEqual([old]);
  await act(async () => buttons.find((b) => b.text === '바꾸기')!.onPress!());
  await waitFor(async () => expect(await stored()).toEqual([fresh]));
});
