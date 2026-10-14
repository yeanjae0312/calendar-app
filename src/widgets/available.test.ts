import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import { widgetsAvailable } from './available';

const os = Platform.OS;
afterEach(() => {
  Platform.OS = os;
  jest.restoreAllMocks();
  delete NativeModules.AndroidWidget;
});

// 위젯 네이티브 모듈은 직접 만든 안드로이드 앱(개발 빌드·APK)에만 있다. Expo Go에는 없어서, 없을 때 라이브러리를 불러오면 앱이 멈춘다.
test('안드로이드에서 위젯 네이티브 모듈이 있을 때만 위젯을 쓴다', () => {
  Platform.OS = 'android';
  const get = jest.spyOn(TurboModuleRegistry, 'get');
  get.mockReturnValue(null);
  expect(widgetsAvailable()).toBe(false);
  NativeModules.AndroidWidget = {};
  expect(widgetsAvailable()).toBe(true);
  delete NativeModules.AndroidWidget;
  get.mockReturnValue({} as never);
  expect(widgetsAvailable()).toBe(true);
  expect(get).toHaveBeenCalledWith('AndroidWidget');
});

test('아이폰에서는 쓰지 않는다', () => {
  Platform.OS = 'ios';
  jest.spyOn(TurboModuleRegistry, 'get').mockReturnValue({} as never);
  expect(widgetsAvailable()).toBe(false);
});
