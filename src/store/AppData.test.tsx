import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { CalEvent } from '../lib/events';
import { AppDataProvider, upsert, useAppData } from './AppData';

const ev: CalEvent = { id: 'a', title: '치과', date: '2026-10-02', time: '14:00', icon: 'hospital', repeat: 'none' };

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

test('upsert는 같은 id면 바꾸고, 없으면 뒤에 붙인다', () => {
  const b = { ...ev, id: 'b' };
  expect(upsert([ev], b)).toEqual([ev, b]);
  expect(upsert([ev, b], { ...ev, title: '바뀜' })).toEqual([{ ...ev, title: '바뀜' }, b]);
});

test('저장된 일정을 불러오고, 불러오는 중에 빈 목록으로 덮어쓰지 않는다', async () => {
  await AsyncStorage.setItem('events', JSON.stringify([ev]));
  const { result } = await renderHook(() => useAppData(), { wrapper: AppDataProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(result.current.events).toEqual([ev]);
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith('events', '[]');
});

test('일정을 저장하고 지우면 폰 저장소에도 반영된다', async () => {
  const { result } = await renderHook(() => useAppData(), { wrapper: AppDataProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  await act(async () => result.current.saveEvent(ev));
  await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith('events', JSON.stringify([ev])));
  await act(async () => result.current.deleteEvent('a'));
  await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenLastCalledWith('events', '[]'));
});

test('예전 형식(yearly) 일정을 불러오면 repeat로 바꿔 다시 저장한다', async () => {
  const { repeat: _r, ...old } = ev;
  await AsyncStorage.setItem('events', JSON.stringify([{ ...old, yearly: true }]));
  const { result } = await renderHook(() => useAppData(), { wrapper: AppDataProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(result.current.events[0]).toEqual({ ...old, repeat: 'yearly' });
  await waitFor(async () => expect(JSON.parse((await AsyncStorage.getItem('events'))!)[0].repeat).toBe('yearly'));
});

test('replaceAll은 일정과 디데이를 통째로 바꾸고 저장한다', async () => {
  await AsyncStorage.setItem('events', JSON.stringify([ev]));
  const { result } = await renderHook(() => useAppData(), { wrapper: AppDataProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  const b = { ...ev, id: 'b', title: '새 일정' };
  const d = { id: 'd', title: '100일', date: '2026-07-01', countFrom: 1 as const };
  await act(async () => result.current.replaceAll([b], [d]));
  expect(result.current.events).toEqual([b]);
  await waitFor(async () => expect(JSON.parse((await AsyncStorage.getItem('ddays'))!)).toEqual([d]));
});

test('저장소를 읽지 못하면 기존 일정을 빈 목록으로 덮어쓰지 않는다', async () => {
  await AsyncStorage.setItem('events', JSON.stringify([ev]));
  jest.clearAllMocks();
  jest.spyOn(AsyncStorage, 'getItem').mockImplementation(async (key: string) => {
    if (key === 'events') throw new Error('locked');
    return null;
  });
  const { result } = await renderHook(() => useAppData(), { wrapper: AppDataProvider });
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith('events', expect.anything());
  (AsyncStorage.getItem as jest.Mock).mockRestore?.();
});
