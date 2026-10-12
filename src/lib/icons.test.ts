import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_GROUPS, ICON_KEYS, ICONS, iconOf } from './icons';

test('모든 아이콘 이름이 MaterialCommunityIcons에 있다', () => {
  for (const k of ICON_KEYS) expect(MaterialCommunityIcons.glyphMap).toHaveProperty(ICONS[k].glyph);
});

test('아이콘이 50개 넘게 있고, 예전에 쓰던 16개 키는 그대로 남아 있다', () => {
  expect(ICON_KEYS.length).toBeGreaterThan(50);
  for (const k of ['people', 'cup', 'food', 'cake', 'heart', 'gift', 'bag', 'music', 'plane', 'car', 'hospital', 'pill', 'work', 'book', 'gym', 'home']) {
    expect(ICON_KEYS).toContain(k);
  }
});

test('모든 아이콘은 정확히 한 묶음에 들어 있다', () => {
  const grouped = ICON_GROUPS.flatMap((g) => g.keys);
  expect([...grouped].sort()).toEqual([...ICON_KEYS].sort());
  expect(new Set(grouped).size).toBe(grouped.length);
});

test('모르는 아이콘 키는 기본 아이콘으로 바꾼다', () => {
  expect(iconOf('cake')).toBe(ICONS.cake);
  expect(iconOf('deleted-icon')).toBe(ICONS.people);
});
