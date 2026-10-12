import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import CalendarScreen from '../app/calendar';
import { toKey } from './lib/date';

// expo-router의 renderRouter는 같은 파일 안에서 앞 테스트의 화면을 기억한다. 그래서 따로 둔다.
test('달력에서 날짜를 눌러 스티커와 메모를 남기면 저장되고 칸에 스티커가 보인다', async () => {
  const today = toKey(new Date());
  await renderRouter({ _layout: RootLayout, calendar: CalendarScreen }, { initialUrl: `/calendar?day=${today}` });
  await fireEvent.press(await screen.findByLabelText('스티커 🍰'));
  await fireEvent.changeText(screen.getByPlaceholderText('한 줄 메모'), '케이크 먹은 날');
  await fireEvent.press(screen.getByLabelText('닫기'));
  await waitFor(async () =>
    expect(JSON.parse((await AsyncStorage.getItem('days')) ?? '{}')[today]).toEqual({ sticker: '🍰', memo: '케이크 먹은 날' }),
  );
  expect(screen.getByTestId(`sticker-${today}`)).toHaveTextContent('🍰');
});
