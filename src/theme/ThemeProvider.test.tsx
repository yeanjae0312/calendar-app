import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { paletteFor } from './colors';
import { ThemeProvider, useTheme } from './ThemeProvider';

beforeEach(() => AsyncStorage.clear());

test('저장된 테마를 다 읽기 전에는 ready가 false이고, 읽은 뒤 저장된 테마로 시작한다', async () => {
  await AsyncStorage.setItem('theme', JSON.stringify('dark'));
  const { result } = await renderHook(() => useTheme(), { wrapper: ThemeProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(result.current.scheme).toBe('dark');
});

test('색 테마 저장값이 없으면 민트로 시작하고, 고르면 저장하고 바로 바뀐다', async () => {
  await AsyncStorage.setItem('theme', JSON.stringify('dark'));
  const { result } = await renderHook(() => useTheme(), { wrapper: ThemeProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(result.current.colorTheme).toBe('mint');
  expect(result.current.c).toEqual(paletteFor('mint', 'dark'));
  await act(async () => result.current.setColorTheme('lavender'));
  expect(result.current.c).toEqual(paletteFor('lavender', 'dark'));
  expect(result.current.pref).toBe('dark');
  await waitFor(async () => expect(JSON.parse((await AsyncStorage.getItem('colorTheme'))!)).toBe('lavender'));
});

test('저장된 색 테마로 시작하고, 모르는 값이면 민트', async () => {
  await AsyncStorage.setItem('colorTheme', JSON.stringify('sky'));
  const first = await renderHook(() => useTheme(), { wrapper: ThemeProvider });
  await waitFor(() => expect(first.result.current.ready).toBe(true));
  expect(first.result.current.colorTheme).toBe('sky');
  await first.unmount();
  await AsyncStorage.setItem('colorTheme', JSON.stringify('neon'));
  const second = await renderHook(() => useTheme(), { wrapper: ThemeProvider });
  await waitFor(() => expect(second.result.current.ready).toBe(true));
  expect(second.result.current.colorTheme).toBe('mint');
});
