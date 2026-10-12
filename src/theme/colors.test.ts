import * as colors from './colors';
import { COLOR_THEMES, isColorTheme, paletteFor, resolveScheme } from './colors';

test('시스템을 고르면 폰 설정을 따르고, 알 수 없으면 라이트', () => {
  expect(resolveScheme('system', 'dark')).toBe('dark');
  expect(resolveScheme('system', 'light')).toBe('light');
  expect(resolveScheme('system', null)).toBe('light');
});

test('라이트나 다크를 고르면 폰 설정과 상관없이 그대로', () => {
  expect(resolveScheme('light', 'dark')).toBe('light');
  expect(resolveScheme('dark', 'light')).toBe('dark');
});

test('민트 팔레트 값과, 테마를 무시하는 고정 팔레트를 내보내지 않는다', () => {
  expect(paletteFor('mint', 'light').accent).toBe('#9ED6B8');
  expect(paletteFor('mint', 'dark')).toMatchObject({ accent: '#5FE0A0', bg: '#121212' });
  expect(colors).not.toHaveProperty('light');
  expect(colors).not.toHaveProperty('dark');
});

test('테마 다섯 개가 순서대로 있고, 모드마다 공통색은 같고 포인트는 다르다', () => {
  expect(COLOR_THEMES.map((t) => t.label)).toEqual(['민트', '벚꽃', '하늘', '라벤더', '버터']);
  for (const scheme of ['light', 'dark'] as const) {
    const ps = COLOR_THEMES.map((t) => paletteFor(t.value, scheme));
    for (const p of ps) {
      expect(p.tints).toEqual(ps[0].tints);
      expect([p.sun, p.sat, p.scrim]).toEqual([ps[0].sun, ps[0].sat, ps[0].scrim]);
    }
    expect(new Set(ps.map((p) => p.accent)).size).toBe(5);
  }
  expect(paletteFor('butter', 'dark').accent).toBe('#FFD45E');
  expect(paletteFor('sky', 'light').accentInk).toBe('#3D6FAF');
});

test('isColorTheme은 아는 테마 이름만 받는다', () => {
  expect(isColorTheme('blossom')).toBe(true);
  expect(isColorTheme('neon')).toBe(false);
  expect(isColorTheme('toString')).toBe(false);
  expect(isColorTheme(3)).toBe(false);
});

test('다크에서는 바탕·카드·글자가 모든 테마에서 같은 중립 회색이고, 포인트만 테마를 따른다', () => {
  const ps = COLOR_THEMES.map((t) => paletteFor(t.value, 'dark'));
  for (const p of ps) {
    expect([p.bg, p.surface, p.fg, p.muted, p.line, p.dim, p.iconInk]).toEqual(['#121212', '#1E1E1E', '#F5F5F5', '#B5B5B5', '#2E2E2E', '#5C5C5C', '#121212']);
  }
  expect(paletteFor('blossom', 'dark').accent).toBe('#FF8FAB');
});
