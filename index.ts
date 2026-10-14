// 앱 진입점. expo-router를 띄우고, 위젯 모듈이 있는 안드로이드 앱이면 홈 화면 위젯을 그리는 처리기를 등록한다.
// Expo Go에는 위젯 모듈이 없어서 그때는 위젯 라이브러리를 아예 불러오지 않는다.
import 'expo-router/entry';
import { widgetsAvailable } from './src/widgets/available';

if (widgetsAvailable()) {
  const { registerWidgetTaskHandler } = require('react-native-android-widget') as typeof import('react-native-android-widget');
  const { widgetTaskHandler } = require('./src/widgets/taskHandler') as typeof import('./src/widgets/taskHandler');
  registerWidgetTaskHandler(widgetTaskHandler);
}
