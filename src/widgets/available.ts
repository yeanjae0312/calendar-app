import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';

// 위젯 네이티브 모듈은 직접 만든 안드로이드 앱(개발 빌드·APK)에만 있다. Expo Go에는 없고,
// 그때 react-native-android-widget을 불러오면 모듈을 찾다가 앱이 멈춘다. 그래서 있는지 먼저 확인하고 나서야 불러온다.
export const widgetsAvailable = (): boolean =>
  Platform.OS === 'android' && (TurboModuleRegistry.get('AndroidWidget') != null || NativeModules.AndroidWidget != null);
