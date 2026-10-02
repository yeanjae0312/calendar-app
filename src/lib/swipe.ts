// 달력을 좌우로 민 거리로 넘길 달을 정한다. 세로로 더 많이 밀었으면 넘기지 않는다.
export function swipeMonth(dx: number, dy: number): -1 | 0 | 1 {
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 2) return 0;
  return dx < 0 ? 1 : -1;
}
