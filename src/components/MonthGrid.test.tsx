import { fireEvent, render, screen, within } from '@testing-library/react-native';
import type { CalEvent } from '../lib/events';
import type { IconKey } from '../lib/icons';
import { ThemeProvider } from '../theme/ThemeProvider';
import { MonthGrid } from './MonthGrid';

const ev = (id: string, icon: IconKey): CalEvent => ({ id, title: id, date: '2026-10-17', time: null, icon, repeat: 'none' });

test('10월 날짜가 모두 나오고, 일정이 넷인 날은 아이콘 둘과 +2를 보여 준다', async () => {
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
  expect(screen.getByText('+2')).toBeTruthy();
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

test('달을 넘길 때는 카드와 요일 줄은 그대로 두고 날짜 칸만 움직인다', async () => {
  await render(
    <ThemeProvider>
      <MonthGrid y={2026} m={10} events={[]} today="2026-10-30" selected={null} onPressDay={() => {}} bodyStyle={{ opacity: 0.5 }} />
    </ThemeProvider>,
  );
  const body = screen.getByTestId('month-body');
  expect(body).toHaveStyle({ opacity: 0.5 });
  expect(within(body).getByText('31')).toBeTruthy();
  expect(within(body).queryByText('월')).toBeNull();
  expect(screen.getByText('월')).toBeTruthy();
  expect(screen.getByTestId('month-card')).toHaveStyle({ overflow: 'hidden' });
});

test('스티커는 일정이 많은 날에도 칸 오른쪽 위에 보이고, 일정 아이콘과 +N도 그대로 보인다', async () => {
  await render(
    <ThemeProvider>
      <MonthGrid
        y={2026} m={10} today="2026-10-30" selected={null} onPressDay={() => {}}
        events={[ev('a', 'car'), ev('b', 'plane'), ev('c', 'people'), ev('d', 'music')]}
        days={{ '2026-10-17': { sticker: '🍰' }, '2026-10-20': { memo: '메모만' } }}
      />
    </ThemeProvider>,
  );
  expect(screen.getByTestId('sticker-2026-10-17')).toHaveTextContent('🍰');
  expect(screen.getByText('+2')).toBeTruthy();
  expect(screen.queryByTestId('sticker-2026-10-20')).toBeNull();
});

test('오늘 칸의 스티커는 날짜 동그라미 위에 그려지고, 글자 크기 설정에 따라 커지지 않는다', async () => {
  await render(
    <ThemeProvider>
      <MonthGrid y={2026} m={10} today="2026-10-17" selected={null} onPressDay={() => {}} events={[]} days={{ '2026-10-17': { sticker: '🍰' } }} />
    </ThemeProvider>,
  );
  const sticker = screen.getByTestId('sticker-2026-10-17');
  expect(sticker).toHaveProp('allowFontScaling', false);
  expect(sticker).toHaveStyle({ zIndex: 1 });
});

test('일정 아이콘은 줄바꿈하지 않고, 셋까지는 모두 보이고 넷부터는 둘과 +N으로 줄인다', async () => {
  await render(
    <ThemeProvider>
      <MonthGrid
        y={2026} m={10} today="2026-10-30" selected={null} onPressDay={() => {}}
        events={[ev('a', 'car'), ev('b', 'plane'), ev('c', 'people')]}
      />
    </ThemeProvider>,
  );
  const row = screen.getByTestId('icons-2026-10-17');
  expect(row).toHaveStyle({ flexWrap: 'nowrap' });
  expect(row.children).toHaveLength(3);
  expect(screen.queryByText(/^\+/)).toBeNull();
});
