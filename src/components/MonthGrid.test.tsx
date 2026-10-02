import { fireEvent, render, screen } from '@testing-library/react-native';
import type { CalEvent } from '../lib/events';
import type { IconKey } from '../lib/icons';
import { ThemeProvider } from '../theme/ThemeProvider';
import { MonthGrid } from './MonthGrid';

const ev = (id: string, icon: IconKey): CalEvent => ({ id, title: id, date: '2026-10-17', time: null, icon, repeat: 'none' });

test('10월 날짜가 모두 나오고, 일정이 넷인 날은 아이콘 셋과 +1을 보여 준다', async () => {
  await render(
    <ThemeProvider>
      <MonthGrid
        y={2026}
        m={10}
        events={[ev('a', 'car'), ev('b', 'plane'), ev('c', 'people'), ev('d', 'music')]}
        today="2026-10-30"
        selected={null}
        onPressDay={() => {}}
      />
    </ThemeProvider>,
  );
  expect(screen.getByText('31')).toBeTruthy();
  expect(screen.getByText('+1')).toBeTruthy();
});

test('여러 날 일정은 주마다 막대로 이어지고, 두 층을 넘으면 +N을 보여 주며, 누르면 그날을 연다', async () => {
  const multi = (id: string, title: string, date: string, endDate: string, icon: IconKey): CalEvent =>
    ({ id, title, date, endDate, time: null, icon, repeat: 'none' });
  const onPressDay = jest.fn();
  await render(
    <ThemeProvider>
      <MonthGrid
        y={2026}
        m={10}
        events={[
          multi('trip', '제주 여행', '2026-10-16', '2026-10-19', 'plane'),
          multi('fam', '부모님 댁', '2026-10-17', '2026-10-18', 'home'),
          multi('camp', '캠핑', '2026-10-18', '2026-10-19', 'people'),
        ]}
        today="2026-10-01"
        selected={null}
        onPressDay={onPressDay}
      />
    </ThemeProvider>,
  );
  expect(screen.getAllByText('제주 여행')).toHaveLength(2);
  expect(screen.queryByText('캠핑')).toBeNull();
  expect(screen.getAllByText('+1')).toHaveLength(2);
  await fireEvent.press(screen.getByLabelText('18일, 일정 3개'));
  expect(onPressDay).toHaveBeenCalledWith('2026-10-18');
});
