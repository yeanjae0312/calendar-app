import AsyncStorage from '@react-native-async-storage/async-storage';
import { screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import Home from '../app/index';
import { addDays, toKey } from './lib/date';

// expo-router의 renderRouter는 같은 파일 안에서 앞 테스트의 화면을 기억한다. 그래서 홈 테스트는 따로 둔다.
test('홈의 오늘에는 진행 중인 여러 날 일정이 몇째 날인지와 함께 나온다', async () => {
  const today = toKey(new Date());
  await AsyncStorage.setItem(
    'events',
    JSON.stringify([
      { id: 't', title: '제주 여행', date: addDays(today, -1), endDate: addDays(today, 1), time: null, icon: 'plane', yearly: false },
    ]),
  );
  await renderRouter({ _layout: RootLayout, index: Home }, { initialUrl: '/' });
  await waitFor(() => expect(screen.getByText('제주 여행')).toBeTruthy());
  expect(screen.getByText('2일째')).toBeTruthy();
});
