import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type Glyph = ComponentProps<typeof MaterialCommunityIcons>['name'];
export type Tint = 'mint' | 'pink' | 'butter' | 'sky' | 'lav' | 'peach' | 'sage';
export type IconDef = { label: string; tint: Tint; glyph: Glyph };

// 색은 아이콘마다 고정이다. 새 아이콘은 여기에 한 줄 추가한다.
export const ICONS = {
  people: { label: '약속', tint: 'mint', glyph: 'account-group-outline' },
  cup: { label: '카페', tint: 'mint', glyph: 'coffee-outline' },
  food: { label: '식사', tint: 'peach', glyph: 'silverware-fork-knife' },
  cake: { label: '생일', tint: 'peach', glyph: 'cake-variant-outline' },
  heart: { label: '사랑', tint: 'pink', glyph: 'heart-outline' },
  gift: { label: '기념일', tint: 'pink', glyph: 'gift-outline' },
  bag: { label: '쇼핑', tint: 'butter', glyph: 'shopping-outline' },
  music: { label: '공연', tint: 'butter', glyph: 'music-note' },
  plane: { label: '여행', tint: 'sky', glyph: 'airplane' },
  car: { label: '이동', tint: 'sky', glyph: 'car-outline' },
  hospital: { label: '병원', tint: 'sky', glyph: 'hospital-box-outline' },
  pill: { label: '약', tint: 'sky', glyph: 'pill' },
  work: { label: '업무', tint: 'lav', glyph: 'briefcase-outline' },
  book: { label: '공부', tint: 'lav', glyph: 'book-open-variant' },
  gym: { label: '운동', tint: 'sage', glyph: 'dumbbell' },
  home: { label: '집', tint: 'sage', glyph: 'home-outline' },
} as const satisfies Record<string, IconDef>;

export type IconKey = keyof typeof ICONS;
export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

export const iconOf = (key: string): IconDef => (ICONS as Record<string, IconDef>)[key] ?? ICONS.people;
