import { resolveScheme } from './colors';

test('시스템을 고르면 폰 설정을 따르고, 알 수 없으면 라이트', () => {
  expect(resolveScheme('system', 'dark')).toBe('dark');
  expect(resolveScheme('system', 'light')).toBe('light');
  expect(resolveScheme('system', null)).toBe('light');
});

test('라이트나 다크를 고르면 폰 설정과 상관없이 그대로', () => {
  expect(resolveScheme('light', 'dark')).toBe('light');
  expect(resolveScheme('dark', 'light')).toBe('dark');
});
