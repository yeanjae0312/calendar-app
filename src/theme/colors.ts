import type { Tint } from '../lib/icons';

export type ThemePref = 'light' | 'dark' | 'system';

export type Palette = {
  bg: string; surface: string; fg: string; muted: string;
  accent: string; accentSoft: string; accentInk: string;
  sun: string; sat: string; line: string; dim: string; iconInk: string; scrim: string;
  tints: Record<Tint, string>;
};

export const light: Palette = {
  bg: '#F3F8F2', surface: '#FFFFFF', fg: '#2E3B33', muted: '#6F8175',
  accent: '#9ED6B8', accentSoft: '#E3F3EA', accentInk: '#3E8A66',
  sun: '#E58A8A', sat: '#7FA6D6', line: '#E3ECE4', dim: '#C3CEC6', iconInk: '#2E3B33', scrim: 'rgba(15,25,20,0.3)',
  tints: { mint: '#8ED3C3', pink: '#F4B3C0', butter: '#F5D58A', sky: '#A9C8EE', lav: '#C9B8EC', peach: '#F6BE9A', sage: '#B5D9A0' },
};

export const dark: Palette = {
  bg: '#131615', surface: '#1F2421', fg: '#F4F8F5', muted: '#B4C0B9',
  accent: '#5FE0A0', accentSoft: '#1F3B2E', accentInk: '#7CF0B6',
  sun: '#FF8A8A', sat: '#7FB4FF', line: '#2C332F', dim: '#56605A', iconInk: '#131615', scrim: 'rgba(0,0,0,0.6)',
  tints: { mint: '#5EDCC4', pink: '#FF9DB3', butter: '#FFD66B', sky: '#7FBFFF', lav: '#B9A2FF', peach: '#FFAF7A', sage: '#9EE07F' },
};

export function resolveScheme(pref: ThemePref, system: string | null | undefined): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}
