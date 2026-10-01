import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_KEYS, ICONS, iconOf } from './icons';

test('모든 아이콘 이름이 MaterialCommunityIcons에 있다', () => {
  for (const k of ICON_KEYS) expect(MaterialCommunityIcons.glyphMap).toHaveProperty(ICONS[k].glyph);
});

test('시안의 아이콘 16개가 있다', () => {
  expect(ICON_KEYS).toHaveLength(16);
});

test('모르는 아이콘 키는 기본 아이콘으로 바꾼다', () => {
  expect(iconOf('cake')).toBe(ICONS.cake);
  expect(iconOf('deleted-icon')).toBe(ICONS.people);
});
