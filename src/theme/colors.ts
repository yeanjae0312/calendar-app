import type { Tint } from '../lib/icons';

export type ThemePref = 'light' | 'dark' | 'system';

export type Palette = {
  bg: string; surface: string; fg: string; muted: string;
  accent: string; accentSoft: string; accentInk: string;
  sun: string; sat: string; line: string; dim: string; iconInk: string; scrim: string;
  tints: Record<Tint, string>;
};

export type ColorTheme = 'mint' | 'blossom' | 'sky' | 'lavender' | 'butter';

type Accent = Pick<Palette, 'accent' | 'accentSoft' | 'accentInk'>;
type Tone = Accent & Pick<Palette, 'bg' | 'surface' | 'fg' | 'muted' | 'line' | 'dim' | 'iconInk'>;
type Shared = Pick<Palette, 'sun' | 'sat' | 'scrim' | 'tints'>;

// 모든 색 테마에서 같은 색. 아이콘 칩 색은 "병원은 하늘색"처럼 의미로 기억하므로 테마를 따라 바꾸지 않는다.
const SHARED: { light: Shared; dark: Shared & Omit<Tone, keyof Accent> } = {
  light: {
    sun: '#E58A8A', sat: '#7FA6D6', scrim: 'rgba(15,25,20,0.3)',
    tints: { mint: '#8ED3C3', pink: '#F4B3C0', butter: '#F5D58A', sky: '#A9C8EE', lav: '#C9B8EC', peach: '#F6BE9A', sage: '#B5D9A0' },
  },
  // 다크의 바탕·카드·글자는 테마와 상관없는 중립 회색이다. 검정에 테마 색을 섞으면 탁해 보여서 포인트에만 테마 색을 쓴다.
  dark: {
    bg: '#121212', surface: '#1E1E1E', fg: '#F5F5F5', muted: '#B5B5B5', line: '#2E2E2E', dim: '#5C5C5C', iconInk: '#121212',
    sun: '#FF8A8A', sat: '#7FB4FF', scrim: 'rgba(0,0,0,0.6)',
    tints: { mint: '#5EDCC4', pink: '#FF9DB3', butter: '#FFD66B', sky: '#7FBFFF', lav: '#B9A2FF', peach: '#FFAF7A', sage: '#9EE07F' },
  },
};

const TONES: Record<ColorTheme, { label: string; light: Tone; dark: Accent }> = {
  mint: {
    label: '민트',
    light: { bg: '#F3F8F2', surface: '#FFFFFF', fg: '#2E3B33', muted: '#6F8175', accent: '#9ED6B8', accentSoft: '#E3F3EA', accentInk: '#3E8A66', line: '#E3ECE4', dim: '#C3CEC6', iconInk: '#2E3B33' },
    dark: { accent: '#5FE0A0', accentSoft: '#1F3B2E', accentInk: '#7CF0B6' },
  },
  blossom: {
    label: '벚꽃',
    light: { bg: '#FBF4F5', surface: '#FFFFFF', fg: '#3D2F33', muted: '#86727A', accent: '#F4B3C0', accentSoft: '#FBE6EA', accentInk: '#C2566F', line: '#F0E2E5', dim: '#D9C6CB', iconInk: '#3D2F33' },
    dark: { accent: '#FF8FAB', accentSoft: '#3F2630', accentInk: '#FFB0C4' },
  },
  sky: {
    label: '하늘',
    light: { bg: '#F2F6FB', surface: '#FFFFFF', fg: '#2C3646', muted: '#6E7C90', accent: '#A9C8EE', accentSoft: '#E3EDFA', accentInk: '#3D6FAF', line: '#E1E8F2', dim: '#C2CCD9', iconInk: '#2C3646' },
    dark: { accent: '#6FB3FF', accentSoft: '#1F3149', accentInk: '#9CCBFF' },
  },
  lavender: {
    label: '라벤더',
    light: { bg: '#F6F3FB', surface: '#FFFFFF', fg: '#352F45', muted: '#7B7290', accent: '#C9B8EC', accentSoft: '#EEE7FA', accentInk: '#6B52B0', line: '#E8E2F2', dim: '#CEC6DC', iconInk: '#352F45' },
    dark: { accent: '#B497FF', accentSoft: '#2F2547', accentInk: '#CDB8FF' },
  },
  butter: {
    label: '버터',
    light: { bg: '#FBF8EE', surface: '#FFFFFF', fg: '#3B3628', muted: '#857C66', accent: '#F5D58A', accentSoft: '#FBF0D2', accentInk: '#A07A1E', line: '#EFE8D6', dim: '#D6CDB6', iconInk: '#3B3628' },
    dark: { accent: '#FFD45E', accentSoft: '#3A321C', accentInk: '#FFE08A' },
  },
};

export const COLOR_THEMES = (Object.keys(TONES) as ColorTheme[]).map((value) => ({ value, label: TONES[value].label }));

export const isColorTheme = (v: unknown): v is ColorTheme =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(TONES, v);

export const paletteFor = (theme: ColorTheme, scheme: 'light' | 'dark'): Palette =>
  scheme === 'dark' ? { ...SHARED.dark, ...TONES[theme].dark } : { ...SHARED.light, ...TONES[theme].light };

export function resolveScheme(pref: ThemePref, system: string | null | undefined): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}
