import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { loadWidgetData, widgetTaskHandler } from './taskHandler';

beforeEach(() => AsyncStorage.clear());

const props = (widgetAction: WidgetTaskHandlerProps['widgetAction'], widgetName = 'DDay') => ({
  widgetAction,
  widgetInfo: { widgetName, widgetId: 1, width: 100, height: 100, screenInfo: { screenHeightDp: 800, screenWidthDp: 400, density: 3, densityDpi: 480 } },
  renderWidget: jest.fn(),
});

test('저장소에서 일정(예전 형식 포함)·디데이·꾸미기·색 테마·공휴일을 읽는다', async () => {
  await AsyncStorage.setItem('events', JSON.stringify([{ id: 'a', title: '생일', date: '2026-10-14', time: null, icon: 'cake', yearly: true }]));
  await AsyncStorage.setItem('ddays', JSON.stringify([{ id: 'd', title: '100일', date: '2026-11-04', countFrom: 1 }]));
  await AsyncStorage.setItem('days', JSON.stringify({ '2026-10-09': { sticker: '☀️' } }));
  await AsyncStorage.setItem('colorTheme', JSON.stringify('butter'));
  const d = await loadWidgetData();
  expect(d.events[0].repeat).toBe('yearly');
  expect(d.ddays).toHaveLength(1);
  expect(d.days['2026-10-09'].sticker).toBe('☀️');
  expect(d.colorTheme).toBe('butter');
  expect(d.holidays['2026-10-09']).toBe('한글날');
});

test('저장된 게 없거나 색 테마가 이상하면 빈 값과 민트로 읽는다', async () => {
  await AsyncStorage.setItem('colorTheme', JSON.stringify('neon'));
  expect(await loadWidgetData()).toMatchObject({ events: [], ddays: [], days: {}, colorTheme: 'mint' });
});

test('위젯을 추가하거나 갱신할 때 그 이름의 위젯을 그리고, 지울 때는 그리지 않는다', async () => {
  for (const action of ['WIDGET_ADDED', 'WIDGET_UPDATE', 'WIDGET_RESIZED'] as const) {
    const p = props(action, 'Today');
    await widgetTaskHandler(p);
    expect(p.renderWidget).toHaveBeenCalledTimes(1);
  }
  const del = props('WIDGET_DELETED');
  await widgetTaskHandler(del);
  expect(del.renderWidget).not.toHaveBeenCalled();
});
