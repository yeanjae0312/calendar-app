import { render, screen } from '@testing-library/react-native';
import { Emoji } from './Emoji';

// 아이폰은 이모지를 다른 글꼴로 대신 그린다. 앱 글꼴과 빠듯한 줄 높이를 쓰면 위쪽이 잘린다.
test('이모지는 시스템 글꼴로, 글자보다 넉넉한 줄 높이로 그리고 글꼴 확대를 따르지 않는다', async () => {
  await render(<Emoji size={10} testID="e">🍰</Emoji>);
  const e = screen.getByTestId('e');
  expect(e).toHaveProp('allowFontScaling', false);
  expect(e).not.toHaveStyle({ fontFamily: expect.anything() });
  expect(e).toHaveStyle({ fontSize: 10, lineHeight: 13 });
});
