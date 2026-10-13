import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor } from '@testing-library/react-native';
import { paletteFor } from '../theme/colors';
import { ThemeProvider } from '../theme/ThemeProvider';
import { MonthCard } from './MonthCard';

beforeEach(() => AsyncStorage.clear());

const days = { '2026-10-09': { sticker: '☀️' }, '2026-10-10': { sticker: '🥰' }, '2026-10-12': { memo: '메모는 안 보여요' } };

test('스티커를 붙인 날은 스티커, 안 붙인 날은 날짜 숫자, 아래에 꾸민 날 수를 보여 준다', async () => {
  await render(
    <ThemeProvider>
      <MonthCard y={2026} m={10} days={days} width={270} />
    </ThemeProvider>,
  );
  expect(screen.getByText('10월')).toBeTruthy();
  expect(screen.getByText('2026')).toBeTruthy();
  expect(screen.getByText('☀️')).toBeTruthy();
  expect(screen.queryByText('9')).toBeNull();
  expect(screen.getByText('11')).toBeTruthy();
  expect(screen.getByText('꾸민 날 2일')).toBeTruthy();
  expect(screen.queryByText('메모는 안 보여요')).toBeNull();
  expect(screen.getByTestId('month-card')).toHaveStyle({ width: 270, height: 480 });
});

test('다크 모드여도 공유 이미지는 고른 색 테마의 밝은 색으로 그린다', async () => {
  await AsyncStorage.setItem('theme', JSON.stringify('dark'));
  await AsyncStorage.setItem('colorTheme', JSON.stringify('sky'));
  await render(
    <ThemeProvider>
      <MonthCard y={2026} m={10} days={{}} width={270} />
    </ThemeProvider>,
  );
  await waitFor(() => expect(screen.getByTestId('month-card')).toHaveStyle({ backgroundColor: paletteFor('sky', 'light').accentSoft }));
  expect(screen.getByText('꾸민 날 0일')).toBeTruthy();
});
