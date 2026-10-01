import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { loadJSON, saveJSON } from '../store/storage';
import { dark, light, Palette, resolveScheme, ThemePref } from './colors';

type Theme = {
  ready: boolean;
  c: Palette;
  scheme: 'light' | 'dark';
  pref: ThemePref;
  setPref: (p: ThemePref) => void;
};

const Ctx = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [pref, setPrefState] = useState<ThemePref>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadJSON<ThemePref>('theme', 'system').then((r) => {
      setPrefState(r.value);
      setReady(true);
    });
  }, []);

  const scheme = resolveScheme(pref, system);
  const value = useMemo<Theme>(
    () => ({
      ready,
      c: scheme === 'dark' ? dark : light,
      scheme,
      pref,
      setPref: (p) => {
        setPrefState(p);
        saveJSON('theme', p);
      },
    }),
    [ready, scheme, pref],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): Theme {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme은 ThemeProvider 안에서 써야 해요');
  return v;
}
