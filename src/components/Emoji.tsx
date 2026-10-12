import { Text, TextProps } from 'react-native';

// 이모지는 앱 글꼴 대신 시스템 글꼴로 그린다. 아이폰은 이모지를 다른 글꼴로 대신 그리는데,
// 앱 글꼴의 높이와 빠듯한 줄 높이를 쓰면 위쪽이 잘린다. 글꼴 확대도 따르지 않아 칸 밖으로 넘치지 않는다.
export function Emoji({ size, style, ...rest }: TextProps & { size: number }) {
  return <Text {...rest} allowFontScaling={false} style={[{ fontSize: size, lineHeight: Math.round(size * 1.3) }, style]} />;
}
