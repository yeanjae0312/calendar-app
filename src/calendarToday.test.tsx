import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import CalendarScreen from '../app/calendar';
import { addMonths, parseKey, toKey } from './lib/date';

// expo-router의 renderRouter는 같은 파일 안에서 앞 테스트의 화면을 기억한다. 그래서 따로 둔다.
test('다른 달로 넘기면 "이번 달로" 버튼이 생기고, 누르면 이번 달로 돌아온다', async () => {
  const t = parseKey(toKey(new Date()));
  const next = addMonths(t.y, t.m, 1);
  await renderRouter({ _layout: RootLayout, calendar: CalendarScreen }, { initialUrl: '/calendar' });
  await waitFor(() => expect(screen.getByText(`${t.m}월 ${t.y}`)).toBeTruthy());
  expect(screen.queryByLabelText('이번 달로')).toBeNull();

  await fireEvent.press(screen.getByLabelText('다음 달'));
  await waitFor(() => expect(screen.getByText(`${next.m}월 ${next.y}`)).toBeTruthy());

  await fireEvent.press(screen.getByLabelText('이번 달로'));
  await waitFor(() => expect(screen.getByText(`${t.m}월 ${t.y}`)).toBeTruthy());
  expect(screen.queryByLabelText('이번 달로')).toBeNull();
});
