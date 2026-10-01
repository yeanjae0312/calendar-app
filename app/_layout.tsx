import { GowunDodum_400Regular } from '@expo-google-fonts/gowun-dodum';
import { Jua_400Regular, useFonts } from '@expo-google-fonts/jua';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppDataProvider, useAppData } from '../src/store/AppData';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';

// 글꼴, 저장된 데이터, 저장된 테마를 모두 읽을 때까지 시작 화면을 유지한다.
SplashScreen.preventAutoHideAsync().catch(() => {});

function Inner() {
  const { c, scheme, ready: themeReady } = useTheme();
  const { ready: dataReady } = useAppData();
  const ready = themeReady && dataReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }} />
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({ Jua_400Regular, GowunDodum_400Regular });
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <AppDataProvider>
        <Inner />
      </AppDataProvider>
    </ThemeProvider>
  );
}
