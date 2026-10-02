import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { holidayName } from '../lib/holidays';
import { HolidayProvider, useHolidays } from './Holidays';

const Probe = ({ k }: { k: string }) => <Text>{holidayName(k, useHolidays()) ?? '없음'}</Text>;
const body = { response: { header: { resultCode: '00' }, body: { items: { item: { locdate: 20280126, dateName: '설날', isHoliday: 'Y' } } } } };
const okFetch = () => jest.fn(async () => ({ ok: true, json: async () => body })) as unknown as typeof fetch;
const june2027 = () => new Date(2027, 5, 1).getTime();

beforeEach(() => AsyncStorage.clear());

test('키가 있으면 올해와 내년을 받아 와서 보여 주고 캐시에 저장한다', async () => {
  const f = okFetch();
  await render(<HolidayProvider apiKey="k" fetchFn={f} now={june2027}><Probe k="2028-01-26" /></HolidayProvider>);
  await waitFor(() => expect(screen.getByText('설날')).toBeTruthy());
  expect(f).toHaveBeenCalledTimes(2);
  expect(JSON.parse((await AsyncStorage.getItem('holidays'))!)['2028'].days).toEqual({ '2028-01-26': '설날' });
});

test('7일 안에 받은 해는 다시 부르지 않고 저장한 공휴일을 쓴다', async () => {
  const now = june2027();
  await AsyncStorage.setItem('holidays', JSON.stringify({ 2027: { fetchedAt: now, days: {} }, 2028: { fetchedAt: now, days: { '2028-01-26': '설날' } } }));
  const f = okFetch();
  await render(<HolidayProvider apiKey="k" fetchFn={f} now={() => now}><Probe k="2028-01-26" /></HolidayProvider>);
  await waitFor(() => expect(screen.getByText('설날')).toBeTruthy());
  expect(f).not.toHaveBeenCalled();
});

test('키가 없으면 부르지 않고 번들 공휴일을 쓴다', async () => {
  const f = okFetch();
  await render(<HolidayProvider apiKey="" fetchFn={f}><Probe k="2026-10-09" /></HolidayProvider>);
  expect(screen.getByText('한글날')).toBeTruthy();
  await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith('holidays'));
  expect(f).not.toHaveBeenCalled();
});

test('받기에 실패해도 번들 공휴일이 남는다', async () => {
  const fail = jest.fn(async () => { throw new Error('offline'); }) as unknown as typeof fetch;
  await render(<HolidayProvider apiKey="k" fetchFn={fail} now={june2027}><Probe k="2027-05-05" /></HolidayProvider>);
  await waitFor(() => expect(fail).toHaveBeenCalledTimes(2));
  expect(screen.getByText('어린이날')).toBeTruthy();
});
