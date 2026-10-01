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
  bg: '#141B17', surface: '#1D2621', fg: '#E4EEE7', muted: '#8FA396',
  accent: '#6FB894', accentSoft: '#23372C', accentInk: '#A9E0C3',
  sun: '#E59A9A', sat: '#93B4DE', line: '#26322B', dim: '#46554B', iconInk: '#111714', scrim: 'rgba(0,0,0,0.5)',
  tints: { mint: '#5FAE9E', pink: '#D98C9C', butter: '#D7B665', sky: '#7FA2CC', lav: '#A08FCB', peach: '#D69A76', sage: '#8DB67A' },
};

export function resolveScheme(pref: ThemePref, system: string | null | undefined): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}
