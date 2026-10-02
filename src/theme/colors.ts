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
  bg: '#131615', surface: '#1C201E', fg: '#E8ECEA', muted: '#8E9893',
  accent: '#86C9A6', accentSoft: '#232E29', accentInk: '#A8DCC0',
  sun: '#F0A3A3', sat: '#9DBBE6', line: '#272C29', dim: '#434A46', iconInk: '#131615', scrim: 'rgba(0,0,0,0.55)',
  tints: { mint: '#7CCBB7', pink: '#E8A3B1', butter: '#E6C77A', sky: '#93B6E2', lav: '#B4A3DE', peach: '#E6AE8A', sage: '#A3CC8E' },
};

export function resolveScheme(pref: ThemePref, system: string | null | undefined): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}
