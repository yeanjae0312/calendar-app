// 달력을 좌우로 민 거리로 넘길 달을 정한다. 세로로 더 많이 밀었으면 넘기지 않는다.
export function swipeMonth(dx: number, dy: number): -1 | 0 | 1 {
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 2) return 0;
  return dx < 0 ? 1 : -1;
}

// 아래에서 올라온 창을 손잡이로 끌어내렸을 때 닫을지 정한다. 충분히(120) 내리거나, 조금이라도 빠르게 휙 내리면 닫는다.
export const shouldCloseSheet = (dy: number, vy: number): boolean => dy > 120 || (dy > 30 && vy > 0.8);
