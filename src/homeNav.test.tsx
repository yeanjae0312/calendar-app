import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import CalendarScreen from '../app/calendar';
import Home from '../app/index';
import { addDays, parseKey, toKey } from './lib/date';

// expo-router의 renderRouter는 같은 파일 안에서 앞 테스트의 화면을 기억한다. 그래서 따로 둔다.
test('홈의 다가오는 일정을 누르면 달력이 그 달로 열리고 그날 목록이 뜬다', async () => {
  const day = addDays(toKey(new Date()), 40);
  await AsyncStorage.setItem('events', JSON.stringify([{ id: 'a', title: '치과', date: day, time: null, icon: 'hospital', repeat: 'none' }]));
  await renderRouter({ _layout: RootLayout, index: Home, calendar: CalendarScreen }, { initialUrl: '/' });
  await fireEvent.press(await screen.findByText('치과'));
  await waitFor(() => expect(screen.getByText('+ 이 날에 일정 추가')).toBeTruthy());
  // 달력 제목은 "11월 2026"처럼 달과 연도가 한 줄로 합쳐진다.
  const { y, m } = parseKey(day);
  expect(screen.getByText(`${m}월 ${y}`)).toBeTruthy();
  // 뒤에 가려진 홈 화면은 빼고 찾으므로, 보이는 '치과'는 그날 목록의 것이다.
  expect(screen.getByText('치과')).toBeTruthy();
});
