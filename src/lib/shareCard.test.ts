import * as Sharing from 'expo-sharing';
import { PixelRatio, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { shareCard } from './shareCard';

jest.mock('react-native-view-shot', () => ({ captureRef: jest.fn(async () => 'file:///tmp/card.png') }));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn(async () => {}) }));

const os = Platform.OS;
afterEach(() => {
  Platform.OS = os;
  jest.clearAllMocks();
});

// react-native-view-shot은 iOS에서는 크기를 포인트로 받아 기기 배율을 곱하고, 안드로이드에서는 그대로 픽셀로 쓴다.
test('iOS에서는 기기 배율로 나눈 포인트 크기로 찍어 1080×1920이 되게 한다', async () => {
  Platform.OS = 'ios';
  jest.spyOn(PixelRatio, 'get').mockReturnValue(3);
  const ref = { current: null };
  await shareCard(ref);
  expect(captureRef).toHaveBeenCalledWith(ref, { format: 'png', quality: 1, result: 'tmpfile', width: 360, height: 640 });
  expect(Sharing.shareAsync).toHaveBeenCalledWith('file:///tmp/card.png', { mimeType: 'image/png', dialogTitle: '이달 돌아보기' });
});

test('안드로이드에서는 1080×1920 픽셀을 그대로 넘긴다', async () => {
  Platform.OS = 'android';
  jest.spyOn(PixelRatio, 'get').mockReturnValue(3);
  await shareCard({ current: null });
  expect(captureRef).toHaveBeenCalledWith({ current: null }, { format: 'png', quality: 1, result: 'tmpfile', width: 1080, height: 1920 });
});
