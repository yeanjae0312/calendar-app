import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, waitFor } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from './ThemeProvider';

beforeEach(() => AsyncStorage.clear());

test('저장된 테마를 다 읽기 전에는 ready가 false이고, 읽은 뒤 저장된 테마로 시작한다', async () => {
  await AsyncStorage.setItem('theme', JSON.stringify('dark'));
  const { result } = await renderHook(() => useTheme(), { wrapper: ThemeProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(result.current.scheme).toBe('dark');
});
