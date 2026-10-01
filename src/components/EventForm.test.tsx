import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react-native';
import { AppDataProvider } from '../store/AppData';
import { ThemeProvider } from '../theme/ThemeProvider';
import { EventForm } from './EventForm';

beforeEach(() => AsyncStorage.clear());

const open = async (onClose = () => {}) => {
  await render(
    <ThemeProvider>
      <AppDataProvider>
        <EventForm draft={{ date: '2026-10-17' }} onClose={onClose} />
      </AppDataProvider>
    </ThemeProvider>,
  );
};

const chip = (label: string) => screen.getByLabelText(label);
const chipShows = (label: string, text: string) => expect(within(chip(label)).getByText(text)).toBeTruthy();
const saved = async () => JSON.parse((await AsyncStorage.getItem('events')) ?? '[]');
const timed = async () => fireEvent(screen.getByLabelText('하루 종일'), 'valueChange', false);

test('시작 날짜 칩을 누르면 창 안에 달력이 펼쳐지고, 고른 날짜가 칩에 바로 보인다', async () => {
  await open();
  expect(screen.queryByText('2026년 10월')).toBeNull();
  await fireEvent.press(chip('시작 날짜'));
  expect(screen.getByText('2026년 10월')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('10월 20일'));
  chipShows('시작 날짜', '2026. 10. 20.');
});

test('하루 종일을 끄면 시간 칩이 생기고, 자주 쓰는 시간을 눌러 저장할 수 있다', async () => {
  const onClose = jest.fn();
  await open(onClose);
  expect(screen.queryByLabelText('시작 시간')).toBeNull();
  await timed();
  await fireEvent.press(chip('시작 시간'));
  await fireEvent.press(screen.getByText('오후 3시'));
  chipShows('시작 시간', '오후 3:00');
  await fireEvent.changeText(screen.getByPlaceholderText('일정 제목'), '치과');
  await fireEvent.press(screen.getByText('저장'));
  await waitFor(async () => expect((await saved())[0]).toMatchObject({ title: '치과', date: '2026-10-17', time: '15:00' }));
  expect(onClose).toHaveBeenCalled();
});

test('한 번에 하나만 펼쳐진다', async () => {
  await open();
  await timed();
  await fireEvent.press(chip('시작 날짜'));
  expect(screen.getByText('2026년 10월')).toBeTruthy();
  await fireEvent.press(chip('시작 시간'));
  expect(screen.queryByText('2026년 10월')).toBeNull();
  await fireEvent.press(chip('종료 시간'));
  expect(screen.getAllByText('오후 3시')).toHaveLength(1);
});

test('하루 종일이면 종료 줄에 날짜 칩만 있고, 끄면 종료 시간이 시작보다 1시간 뒤로 잡힌다', async () => {
  await open();
  chipShows('종료 날짜', '2026. 10. 17.');
  expect(screen.queryByLabelText('종료 시간')).toBeNull();
  await timed();
  chipShows('종료 시간', '오전 10:00');
});

test('같은 날이면 시작을 늦출 때 종료가 1시간 뒤로 따라가고, 종료를 따로 고를 수 있다', async () => {
  await open();
  await timed();
  await fireEvent.press(chip('시작 시간'));
  await fireEvent.press(screen.getByText('오후 3시'));
  chipShows('종료 시간', '오후 4:00');
  await fireEvent.press(chip('종료 시간'));
  await fireEvent.press(screen.getByText('오후 7시'));
  chipShows('종료 시간', '오후 7:00');
  await fireEvent.changeText(screen.getByPlaceholderText('일정 제목'), '저녁 약속');
  await fireEvent.press(screen.getByText('저장'));
  await waitFor(async () => expect((await saved())[0]).toMatchObject({ time: '15:00', endTime: '19:00' }));
});

test('같은 날이면 종료를 시작보다 이르게 고를 때 시작 5분 뒤로 맞춘다', async () => {
  await open();
  await timed();
  await fireEvent.press(chip('시작 시간'));
  await fireEvent.press(screen.getByText('오후 3시'));
  await fireEvent.press(chip('종료 시간'));
  await fireEvent.press(screen.getByText('오전 9시'));
  chipShows('종료 시간', '오후 3:05');
});

test('종료 날짜는 시작보다 앞을 고를 수 없고, 뒤를 고르면 기간이 보이며 여러 날 일정으로 저장된다', async () => {
  await open();
  await fireEvent.press(chip('종료 날짜'));
  expect(screen.getByLabelText('10월 15일').props.accessibilityState).toMatchObject({ disabled: true });
  await fireEvent.press(screen.getByLabelText('10월 19일'));
  chipShows('종료 날짜', '2026. 10. 19.');
  expect(screen.getByText('3일 동안')).toBeTruthy();
  await fireEvent.changeText(screen.getByPlaceholderText('일정 제목'), '제주 여행');
  await fireEvent.press(screen.getByText('저장'));
  await waitFor(async () => expect((await saved())[0]).toMatchObject({ date: '2026-10-17', endDate: '2026-10-19', time: null }));
});

test('여러 날이면 종료 시간이 시작 시간보다 일러도 그대로 둔다', async () => {
  await open();
  await timed();
  await fireEvent.press(chip('종료 날짜'));
  await fireEvent.press(screen.getByLabelText('10월 18일'));
  await fireEvent.press(chip('종료 시간'));
  await fireEvent.press(screen.getByText('오전 9시'));
  chipShows('종료 시간', '오전 9:00');
});

test('시작 날짜를 종료 날짜 뒤로 옮기면 종료 날짜도 따라간다', async () => {
  await open();
  await fireEvent.press(chip('종료 날짜'));
  await fireEvent.press(screen.getByLabelText('10월 19일'));
  await fireEvent.press(chip('시작 날짜'));
  await fireEvent.press(screen.getByLabelText('10월 21일'));
  chipShows('종료 날짜', '2026. 10. 21.');
});
