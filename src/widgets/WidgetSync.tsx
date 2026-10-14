import { useEffect } from 'react';
import { useToday } from '../lib/useToday';
import { useAppData } from '../store/AppData';
import { useHolidays } from '../store/Holidays';
import { useTheme } from '../theme/ThemeProvider';
import { widgetsAvailable } from './available';

// 앱에서 일정·디데이·꾸미기·색 테마가 바뀌면 홈 화면 위젯을 바로 다시 그린다.
// 위젯 라이브러리는 위젯 모듈이 있는 앱에서만 불러온다(Expo Go에서 불러오면 앱이 멈춘다). 홈 화면에 없는 위젯은 라이브러리가 건너뛴다.
export function WidgetSync() {
  const { ready, events, ddays, days } = useAppData();
  const { colorTheme } = useTheme();
  const holidays = useHolidays();
  const today = useToday();

  useEffect(() => {
    if (!ready || !widgetsAvailable()) return;
    /* eslint-disable @typescript-eslint/no-require-imports -- 위젯 모듈이 있을 때만 불러와야 해서 일부러 require로 늦게 불러온다. */
    const { requestWidgetUpdate } = require('react-native-android-widget') as typeof import('react-native-android-widget');
    const { renderWidgetByName, WIDGET_NAMES } = require('./Widgets') as typeof import('./Widgets');
    /* eslint-enable @typescript-eslint/no-require-imports */
    const data = { events, ddays, days, colorTheme, holidays };
    for (const widgetName of WIDGET_NAMES) {
      requestWidgetUpdate({ widgetName, renderWidget: () => renderWidgetByName(widgetName, data, today) }).catch(() => {});
    }
  }, [ready, events, ddays, days, colorTheme, holidays, today]);

  return null;
}
