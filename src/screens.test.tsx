import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import CalendarScreen from '../app/calendar';
import Home from '../app/index';
import Settings from '../app/settings';

// 폰 없이 실제 화면 흐름이 멈추지 않는지 확인하는 연기 테스트.
const routes = { _layout: RootLayout, index: Home, calendar: CalendarScreen, settings: Settings };

const open = async (initialUrl: string) => {
  await renderRouter(routes, { initialUrl });
};

beforeEach(() => AsyncStorage.clear());

test('처음 켜면 홈에 빈 상태 안내가 보인다', async () => {
  await open('/');
  await waitFor(() => expect(screen.getByText('디데이를 추가해 보세요')).toBeTruthy());
  expect(screen.getByText('오늘은 일정이 없어요')).toBeTruthy();
  expect(screen.getByText('예정된 일정이 없어요')).toBeTruthy();
  expect(screen.getByText('캘린더 보기')).toBeTruthy();
});

test('캘린더에서 일정을 추가하면 폰 저장소에 저장된다', async () => {
  await open('/calendar');
  await waitFor(() => expect(screen.getByLabelText('일정 추가')).toBeTruthy());
  await fireEvent.press(screen.getByLabelText('일정 추가'));
  await fireEvent.changeText(screen.getByPlaceholderText('일정 제목'), '치과 검진');
  await fireEvent.press(screen.getByLabelText('병원'));
  await fireEvent.press(screen.getByText('저장'));
  await waitFor(async () => {
    const saved = JSON.parse((await AsyncStorage.getItem('events')) ?? '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ title: '치과 검진', icon: 'hospital', time: null, yearly: false });
  });
});

test('설정 화면에 테마 세 가지와 디데이 추가 버튼이 있다', async () => {
  await open('/settings');
  await waitFor(() => expect(screen.getByText('라이트')).toBeTruthy());
  expect(screen.getByText('다크')).toBeTruthy();
  expect(screen.getByText('시스템')).toBeTruthy();
  expect(screen.getByText('+ 디데이 추가')).toBeTruthy();
});

