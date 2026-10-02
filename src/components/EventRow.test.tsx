import { render, screen } from '@testing-library/react-native';
import type { CalEvent } from '../lib/events';
import { ThemeProvider } from '../theme/ThemeProvider';
import { EventRow } from './EventRow';

const ev: CalEvent = { id: 'a', title: '치과', date: '2026-10-02', time: '14:00', endTime: '15:30', icon: 'hospital', repeat: 'none' };

test('시작과 종료 시간을 범위로 보여 준다', async () => {
  await render(<ThemeProvider><EventRow event={ev} /></ThemeProvider>);
  expect(screen.getByText('오후 2:00 ~ 오후 3:30')).toBeTruthy();
});

test('예전에 저장한 일정은 시작 시간만 보여 준다', async () => {
  const { endTime, ...old } = ev;
  await render(<ThemeProvider><EventRow event={old} /></ThemeProvider>);
  expect(screen.getByText('오후 2:00')).toBeTruthy();
});

test('여러 날 일정은 기간과 몇째 날 배지를 보여 준다', async () => {
  const trip: CalEvent = { id: 't', title: '제주 여행', date: '2026-10-16', endDate: '2026-10-19', time: null, icon: 'plane', repeat: 'none' };
  await render(<ThemeProvider><EventRow event={trip} start="2026-10-16" badge="3일째" /></ThemeProvider>);
  expect(screen.getByText('10월 16일 ~ 10월 19일 · 하루 종일')).toBeTruthy();
  expect(screen.getByText('3일째')).toBeTruthy();
});

test('날짜를 함께 보여 달라고 하면 하루 일정도 날짜를 붙인다', async () => {
  await render(<ThemeProvider><EventRow event={ev} start="2026-10-02" showDate /></ThemeProvider>);
  expect(screen.getByText('10월 2일 금 · 오후 2:00 ~ 오후 3:30')).toBeTruthy();
});
