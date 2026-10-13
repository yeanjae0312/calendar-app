import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import { Alert } from 'react-native';
import RootLayout from '../app/_layout';
import CalendarScreen from '../app/calendar';
import { addMonths, parseKey, toKey } from './lib/date';
import { shareCard } from './lib/shareCard';

jest.mock('./lib/shareCard', () => ({ shareCard: jest.fn(async () => {}) }));

// expo-router의 renderRouter는 같은 파일 안에서 앞 테스트의 화면을 기억한다. 그래서 흐름을 한 테스트에 이어서 확인한다.
test('보고 있는 달의 돌아보기 카드를 열어 공유하고, 실패하면 안내한다', async () => {
  const t = parseKey(toKey(new Date()));
  const next = addMonths(t.y, t.m, 1);
  const alert = jest.spyOn(Alert, 'alert');
  await renderRouter({ _layout: RootLayout, calendar: CalendarScreen }, { initialUrl: '/calendar' });
  await fireEvent.press(await screen.findByLabelText('다음 달'));
  await waitFor(() => expect(screen.getByText(`${next.m}월 ${next.y}`)).toBeTruthy());

  await fireEvent.press(screen.getByLabelText('이달 돌아보기'));
  expect(screen.getByText(`${next.m}월`)).toBeTruthy();
  expect(screen.getByText('꾸민 날 0일')).toBeTruthy();

  await fireEvent.press(screen.getByText('공유하기'));
  await waitFor(() => expect(shareCard).toHaveBeenCalledTimes(1));
  expect(alert).not.toHaveBeenCalled();

  (shareCard as jest.Mock).mockRejectedValueOnce(new Error('capture failed'));
  await fireEvent.press(screen.getByText('공유하기'));
  await waitFor(() => expect(alert).toHaveBeenCalledWith('이미지를 만들지 못했어요', '잠시 후 다시 시도해 주세요.'));
});
