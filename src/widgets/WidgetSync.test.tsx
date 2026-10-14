import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { AppDataProvider, useAppData } from '../store/AppData';
import { ThemeProvider } from '../theme/ThemeProvider';
import { widgetsAvailable } from './available';
import { WidgetSync } from './WidgetSync';

jest.mock('react-native-android-widget', () => ({ ...jest.requireActual('react-native-android-widget'), requestWidgetUpdate: jest.fn(async () => {}) }));
jest.mock('./available', () => ({ widgetsAvailable: jest.fn(() => true) }));

const os = Platform.OS;
beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});
afterEach(() => {
  Platform.OS = os;
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <AppDataProvider>
      <WidgetSync />
      {children}
    </AppDataProvider>
  </ThemeProvider>
);
const app = async () => (await renderHook(() => useAppData(), { wrapper })).result;

test('안드로이드에서는 데이터가 바뀌면 위젯 세 개를 모두 다시 그리게 한다', async () => {
  Platform.OS = 'android';
  const api = await app();
  await waitFor(() => expect(api.current.ready).toBe(true));
  await waitFor(() => expect(requestWidgetUpdate).toHaveBeenCalled());
  (requestWidgetUpdate as jest.Mock).mockClear();
  await act(async () => api.current.toggleSticker('2026-10-14', '🍰'));
  await waitFor(() => expect(requestWidgetUpdate).toHaveBeenCalledTimes(3));
  const names = (requestWidgetUpdate as jest.Mock).mock.calls.map((c) => c[0].widgetName).sort();
  expect(names).toEqual(['DDay', 'Stickers', 'Today']);
  expect((requestWidgetUpdate as jest.Mock).mock.calls[0][0].renderWidget()).toBeTruthy();
});

test('위젯을 쓸 수 없는 곳(아이폰, Expo Go)에서는 위젯을 건드리지 않는다', async () => {
  Platform.OS = 'ios';
  (widgetsAvailable as jest.Mock).mockReturnValue(false);
  const api = await app();
  await waitFor(() => expect(api.current.ready).toBe(true));
  await act(async () => api.current.toggleSticker('2026-10-14', '🍰'));
  expect(requestWidgetUpdate).not.toHaveBeenCalled();
});
