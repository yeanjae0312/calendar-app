import { swipeMonth } from './swipe';

test('왼쪽으로 충분히 밀면 다음 달, 오른쪽이면 이전 달', () => {
  expect(swipeMonth(-80, 5)).toBe(1);
  expect(swipeMonth(80, -5)).toBe(-1);
});

test('조금 밀거나 세로로 밀면 넘기지 않는다', () => {
  expect(swipeMonth(-30, 0)).toBe(0);
  expect(swipeMonth(-80, 70)).toBe(0);
});
