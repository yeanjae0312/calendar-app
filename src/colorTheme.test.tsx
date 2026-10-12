import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderRouter } from 'expo-router/testing-library';
import RootLayout from '../app/_layout';
import Settings from '../app/settings';

// expo-router의 renderRouter는 같은 파일 안에서 앞 테스트의 화면을 기억한다. 그래서 따로 둔다.
test('설정에서 색 테마 동그라미를 누르면 저장되고 선택 표시가 옮겨 간다', async () => {
  await renderRouter({ _layout: RootLayout, settings: Settings }, { initialUrl: '/settings' });
  await waitFor(() => expect(screen.getByLabelText('민트 테마')).toBeSelected());
  for (const name of ['벚꽃', '하늘', '라벤더', '버터']) expect(screen.getByLabelText(`${name} 테마`)).not.toBeSelected();
  await fireEvent.press(screen.getByLabelText('벚꽃 테마'));
  await waitFor(async () => expect(JSON.parse((await AsyncStorage.getItem('colorTheme'))!)).toBe('blossom'));
  expect(screen.getByLabelText('벚꽃 테마')).toBeSelected();
  expect(screen.getByLabelText('민트 테마')).not.toBeSelected();
});

test('흰 카드 위에서도 연한 동그라미가 보이게 테두리를 두른다', async () => {
  await renderRouter({ _layout: RootLayout, settings: Settings }, { initialUrl: '/settings' });
  await waitFor(() => expect(screen.getByTestId('swatch-butter')).toBeTruthy());
  expect(screen.getByTestId('swatch-butter')).toHaveStyle({ borderWidth: 1 });
});
