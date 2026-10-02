import { render, screen } from '@testing-library/react-native';
import type { CalEvent } from '../lib/events';
import { ThemeProvider } from '../theme/ThemeProvider';
import { DaySheet } from './DaySheet';

test('그날에 걸친 여러 날 일정을 몇째 날인지와 함께 보여 준다', async () => {
  const trip: CalEvent = { id: 't', title: '제주 여행', date: '2026-10-16', endDate: '2026-10-19', time: null, icon: 'plane', repeat: 'none' };
  await render(
    <ThemeProvider>
      <DaySheet day="2026-10-18" events={[trip]} onClose={() => {}} onAdd={() => {}} onEdit={() => {}} />
    </ThemeProvider>,
  );
  expect(screen.getByText('제주 여행')).toBeTruthy();
  expect(screen.getByText('3일째')).toBeTruthy();
  expect(screen.getByText('10월 16일 ~ 10월 19일 · 하루 종일')).toBeTruthy();
});
