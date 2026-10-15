import { shouldCloseSheet, swipeMonth } from './swipe';

test('왼쪽으로 충분히 밀면 다음 달, 오른쪽이면 이전 달', () => {
  expect(swipeMonth(-80, 5)).toBe(1);
  expect(swipeMonth(80, -5)).toBe(-1);
});

test('조금 밀거나 세로로 밀면 넘기지 않는다', () => {
  expect(swipeMonth(-30, 0)).toBe(0);
  expect(swipeMonth(-80, 70)).toBe(0);
});

test('창은 충분히 내리거나 빠르게 휙 내리면 닫고, 조금만 내리거나 위로 올리면 그대로 둔다', () => {
  expect(shouldCloseSheet(150, 0.1)).toBe(true);
  expect(shouldCloseSheet(40, 1.2)).toBe(true);
  expect(shouldCloseSheet(60, 0.2)).toBe(false);
  expect(shouldCloseSheet(10, 2)).toBe(false);
  expect(shouldCloseSheet(-80, -1)).toBe(false);
});
