import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { HOLIDAYS } from '../data/holidays';
import { toKey } from '../lib/date';
import type { Days } from '../lib/days';
import type { DDay } from '../lib/dday';
import { normalizeEvent, StoredEvent } from '../lib/events';
import { HolidayCache, mergeHolidays } from '../lib/holidayApi';
import { loadJSON } from '../store/storage';
import { isColorTheme } from '../theme/colors';
import { renderWidgetByName, WidgetData } from './Widgets';

// 위젯은 앱이 꺼져 있어도 안드로이드가 불러서 그린다. 그때는 앱 화면의 상태가 없으니 폰 저장소에서 직접 읽는다.
export async function loadWidgetData(): Promise<WidgetData> {
  const [events, ddays, days, colorTheme, holidays] = await Promise.all([
    loadJSON<StoredEvent[]>('events', []),
    loadJSON<DDay[]>('ddays', []),
    loadJSON<Days>('days', {}),
    loadJSON<unknown>('colorTheme', 'mint'),
    loadJSON<HolidayCache>('holidays', {}),
  ]);
  return {
    events: events.value.map(normalizeEvent),
    ddays: ddays.value,
    days: days.value,
    colorTheme: isColorTheme(colorTheme.value) ? colorTheme.value : 'mint',
    holidays: mergeHolidays(HOLIDAYS, holidays.value),
  };
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (props.widgetAction === 'WIDGET_DELETED' || props.widgetAction === 'WIDGET_CLICK') return;
  const data = await loadWidgetData();
  props.renderWidget(renderWidgetByName(props.widgetInfo.widgetName, data, toKey(new Date())));
}
