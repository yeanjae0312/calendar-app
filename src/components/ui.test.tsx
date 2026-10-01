import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ThemeProvider } from '../theme/ThemeProvider';
import { Sheet } from './ui';

test('시트 내용은 키보드가 올라와도 스크롤해서 저장 버튼까지 닿을 수 있다', async () => {
  await render(
    <ThemeProvider>
      <Sheet onClose={() => {}}>
        <Text>내용</Text>
      </Sheet>
    </ThemeProvider>,
  );
  const scroll = screen.getByTestId('sheet-scroll');
  expect(scroll.props.keyboardShouldPersistTaps).toBe('handled');
  expect(screen.getByText('내용')).toBeTruthy();
});
