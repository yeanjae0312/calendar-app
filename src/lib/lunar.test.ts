import KoreanLunarCalendar from 'korean-lunar-calendar';
import { fromLunar, lunarRepeatLabel, toLunar } from './lunar';

// 기대값은 공휴일 표(2026·2027 설날, 2026 추석)와 2025년 윤6월로 확인한 실제 날짜다.
test('양력과 음력을 서로 바꾼다', () => {
  expect(toLunar('2026-09-25')).toEqual({ y: 2026, m: 8, d: 15, leap: false });
  expect(toLunar('2025-07-25')).toEqual({ y: 2025, m: 6, d: 1, leap: true });
  expect(fromLunar(2027, 1, 1)).toBe('2027-02-07');
  expect(fromLunar(2026, 1, 1)).toBe('2026-02-17');
});

test('그해에 없는 음력 30일은 29일로, 지원 범위 밖은 null', () => {
  expect(fromLunar(2026, 3, 30)).toBe('2026-05-16');
  expect(fromLunar(2027, 3, 30)).toBe(fromLunar(2027, 3, 29));
  expect(fromLunar(2051, 1, 1)).toBeNull();
});

test('같은 날짜는 한 번만 바꾸고 결과를 다시 쓴다', () => {
  const solar = jest.spyOn(KoreanLunarCalendar.prototype, 'setSolarDate');
  const lunar = jest.spyOn(KoreanLunarCalendar.prototype, 'setLunarDate');
  for (let i = 0; i < 5; i++) {
    expect(toLunar('2031-03-03')).not.toBeNull();
    expect(fromLunar(2031, 4, 4)).not.toBeNull();
  }
  expect(solar).toHaveBeenCalledTimes(1);
  expect(lunar).toHaveBeenCalledTimes(1);
  solar.mockRestore();
  lunar.mockRestore();
});

test('lunarRepeatLabel은 매년 반복된다는 것과 윤달 처리를 알려 준다', () => {
  expect(lunarRepeatLabel('2026-10-13')).toBe('매년 음력 9월 3일에 반복돼요');
  expect(lunarRepeatLabel('2025-07-25')).toBe('매년 음력 6월 1일에 반복돼요 (첫해는 윤6월 1일)');
  expect(lunarRepeatLabel('2051-03-01')).toBeNull();
});
