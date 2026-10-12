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

// 키보드가 올라와도 창이 화면 맨 위 상태 표시줄(시간·배터리)까지 올라가지 않게 위쪽 여백을 두고, 내용은 줄어들며 스크롤된다.
test('Sheet는 위쪽에 여백을 두고, 공간이 모자라면 내용이 줄어든다', async () => {
  await render(
    <ThemeProvider>
      <Sheet onClose={() => {}}>
        <Text>내용</Text>
      </Sheet>
    </ThemeProvider>,
  );
  expect(screen.getByTestId('sheet-root')).toHaveStyle({ paddingTop: 8 });
  expect(screen.getByTestId('sheet-scroll')).toHaveStyle({ flexShrink: 1 });
});
