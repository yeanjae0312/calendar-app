import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadJSON, saveJSON } from './storage';

beforeEach(() => AsyncStorage.clear());

test('저장된 값이 없으면 기본값을 준다', async () => {
  expect(await loadJSON('x', [])).toEqual({ ok: true, value: [] });
});

test('저장한 값을 그대로 읽는다', async () => {
  await saveJSON('x', [1, 2]);
  expect(await loadJSON('x', [])).toEqual({ ok: true, value: [1, 2] });
});

test('저장 값이 깨져 있으면 기본값을 주고, 깨진 원본은 따로 남긴다', async () => {
  await AsyncStorage.setItem('x', '{broken');
  expect(await loadJSON('x', [])).toEqual({ ok: true, value: [] });
  expect(await AsyncStorage.getItem('x.corrupt')).toBe('{broken');
});

test('저장소를 읽지 못하면 실패로 알려 준다', async () => {
  jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('locked'));
  expect(await loadJSON('x', [])).toEqual({ ok: false, value: [] });
});
