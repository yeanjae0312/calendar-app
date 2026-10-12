import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { loadJSON, saveJSON } from '../store/storage';
import { ColorTheme, isColorTheme, Palette, paletteFor, resolveScheme, ThemePref } from './colors';

type Theme = {
  ready: boolean;
  c: Palette;
  scheme: 'light' | 'dark';
  pref: ThemePref;
  setPref: (p: ThemePref) => void;
  colorTheme: ColorTheme;
  setColorTheme: (t: ColorTheme) => void;
};

const Ctx = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [pref, setPrefState] = useState<ThemePref>('system');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>('mint');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 색 테마가 없거나 모르는 값이면 민트. 업데이트 전부터 쓰던 사람은 민트 테마로 시작한다(다크 바탕은 모든 테마 공통 회색).
    Promise.all([loadJSON<ThemePref>('theme', 'system'), loadJSON<unknown>('colorTheme', 'mint')]).then(([t, ct]) => {
      setPrefState(t.value);
      setColorThemeState(isColorTheme(ct.value) ? ct.value : 'mint');
      setReady(true);
    });
  }, []);

  const scheme = resolveScheme(pref, system);
  const value = useMemo<Theme>(
    () => ({
      ready,
      c: paletteFor(colorTheme, scheme),
      scheme,
      pref,
      setPref: (p) => {
        setPrefState(p);
        saveJSON('theme', p);
      },
      colorTheme,
      setColorTheme: (t) => {
        setColorThemeState(t);
        saveJSON('colorTheme', t);
      },
    }),
    [ready, scheme, pref, colorTheme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): Theme {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme은 ThemeProvider 안에서 써야 해요');
  return v;
}
