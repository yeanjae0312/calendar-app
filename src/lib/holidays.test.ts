import { HOLIDAYS } from '../data/holidays';
import { keyToDate, toKey } from './date';
import { dayTone, holidayName } from './holidays';

test('공휴일 이름을 알려 준다', () => {
  expect(holidayName('2026-10-09')).toBe('한글날');
  expect(holidayName('2026-10-05')).toBe('대체공휴일');
  expect(holidayName('2026-10-06')).toBeUndefined();
});

test('공휴일과 일요일은 빨강, 토요일은 파랑, 공휴일인 토요일은 빨강', () => {
  expect(dayTone('2026-10-03')).toBe('red');
  expect(dayTone('2026-10-10')).toBe('blue');
  expect(dayTone('2026-10-11')).toBe('red');
  expect(dayTone('2026-10-12')).toBe('normal');
});

test('공휴일 목록의 날짜는 모두 실제로 있는 날짜다', () => {
  for (const k of Object.keys(HOLIDAYS)) expect(toKey(keyToDate(k))).toBe(k);
});

test('2026년부터 공휴일이 된 노동절과 제헌절, 2027년 대체공휴일이 들어 있다', () => {
  expect(holidayName('2026-05-01')).toBe('노동절');
  expect(holidayName('2026-07-17')).toBe('제헌절');
  expect(holidayName('2027-05-01')).toBe('노동절');
  expect(holidayName('2027-05-03')).toBe('대체공휴일');
  expect(holidayName('2027-07-17')).toBe('제헌절');
  expect(holidayName('2027-07-19')).toBe('대체공휴일');
});
