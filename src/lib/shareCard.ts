import * as Sharing from 'expo-sharing';
import type { RefObject } from 'react';
import { PixelRatio, Platform, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

const W = 1080;
const H = 1920;

// 돌아보기 카드를 인스타 스토리 크기(1080×1920) PNG로 찍어 공유창을 띄운다.
// react-native-view-shot은 iOS에서는 크기를 포인트로 받아 기기 배율을 곱하고, 안드로이드에서는 그대로 픽셀로 쓴다.
export async function shareCard(ref: RefObject<View | null>): Promise<void> {
  const scale = Platform.OS === 'ios' ? PixelRatio.get() : 1;
  const uri = await captureRef(ref, { format: 'png', quality: 1, result: 'tmpfile', width: W / scale, height: H / scale });
  await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: '이달 돌아보기' });
}
