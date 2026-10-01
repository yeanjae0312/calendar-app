import { act, renderHook } from '@testing-library/react-native';
import { useToday } from './useToday';

afterEach(() => jest.useRealTimers());

test('앱을 켜 둔 채 자정이 지나면 오늘 날짜가 바뀐다', async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 9, 30, 23, 59, 58));
  const { result } = await renderHook(() => useToday());
  expect(result.current).toBe('2026-10-30');
  await act(async () => {
    jest.advanceTimersByTime(5000);
  });
  expect(result.current).toBe('2026-10-31');
});
