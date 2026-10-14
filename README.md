# 하루조각

파스텔 초록 느낌의 간단한 달력 앱이다. Expo(React Native)로 만들었고, Android APK로 배포하는 것을 목표로 한다. 데이터는 서버 없이 폰 안에만 저장한다.

## 주요 기능

- **홈 요약.** 디데이, 오늘 일정, 다가오는 일정, 이번 달 일정 수를 한눈에 보여 준다.
- **월간 달력.** 일요일과 공휴일은 빨강, 토요일은 파랑으로 표시한다. 하루 일정은 작은 아이콘으로, 여러 날 일정은 막대로 보여 준다. 겹치는 막대는 두 층까지 보이고, 넘치면 "+N"이 붙는다.
- **일정 등록.** 제목, 시작과 종료 날짜·시간, 하루 종일, 반복(안 함·매주·매월·매년·음력 매년), 아이콘을 정할 수 있다. 매월 31일처럼 그 달에 없는 날짜는 말일로 옮긴다. 날짜와 시간은 아이폰 캘린더처럼 창 안에 펼쳐지는 달력과 휠로 고른다.
- **아이콘.** 16개 아이콘 중에서 고른다. 색은 아이콘마다 정해져 있다.
- **디데이.** 여러 개를 등록할 수 있고, 첫날을 1일로 셀지 0일로 셀지 디데이마다 고를 수 있다.
- **음력 매년.** 부모님 음력 생신처럼 해마다 같은 음력 날짜에 표시한다. 윤달에 등록하면 다음 해부터 평달에 표시하고, 2050년까지 지원한다.
- **하루 꾸미기.** 날짜마다 이모지 스티커 하나와 한 줄 메모(40자)를 남긴다. 스티커는 달력 칸 오른쪽 위에 보인다.
- **홈에서 바로 이동.** 홈의 오늘·다가오는 일정을 누르면 달력이 그날로 열린다.
- **공휴일.** 공공데이터포털 특일 정보 API에서 올해와 내년 공휴일을 받아 폰에 저장하고, 일주일에 한 번 새로 받는다. 받지 못하면 앱에 들어 있는 2026·2027년 표를 쓴다.
- **백업.** 설정에서 일정, 디데이, 하루 꾸미기(스티커·메모)를 JSON 파일로 내보내고 다시 가져올 수 있다. 가져오면 지금 데이터를 통째로 바꾼다. 꾸미기가 없던 예전 백업을 가져오면 지금의 꾸미기도 모두 지워진다.
- **홈 화면 위젯 (안드로이드).** 디데이(2×2), 오늘 일정(4×2), 이번 달 스티커(4×4). 앱에서 바꾸면 바로, 그 밖에는 30분마다 새로 그린다. 누르면 관련 화면이 열린다. Expo Go에서는 위젯이 없고 개발용 빌드나 APK에서만 보인다.
- **테마.** 색 테마 5개(민트·벚꽃·하늘·라벤더·버터)와 라이트, 다크, 폰 설정 따르기를 따로 고른다. 앱 아이콘과 시작 화면은 민트 그대로다.

## 기술 스택

| 영역 | 사용한 것 |
|---|---|
| 앱 | Expo SDK 57, React Native 0.86, React 19, TypeScript |
| 화면 이동 | expo-router |
| 저장 | @react-native-async-storage/async-storage |
| 시간 휠 | @quidone/react-native-wheel-picker |
| 아이콘 | @expo/vector-icons (MaterialCommunityIcons) |
| 글꼴 | Jua, Gowun Dodum (@expo-google-fonts) |
| 테스트 | Jest (jest-expo), @testing-library/react-native |
| 빌드 | EAS Build |

## 시작하기

Node.js가 필요하다. 처음 한 번 라이브러리를 설치한다.

```bash
npm install
```

공휴일 API 키를 넣는다. [공공데이터포털](https://www.data.go.kr)에서 "한국천문연구원_특일 정보"를 활용신청하고(자동 승인, 무료), 마이페이지의 일반 인증키(Decoding)를 프로젝트 폴더의 `.env`에 적는다. `.env`는 git에 올리지 않는다. 키가 없어도 앱은 동작하고, 앱에 들어 있는 공휴일 표만 쓴다.

```
EXPO_PUBLIC_HOLIDAY_API_KEY=발급받은키
```

개발 서버를 켠다. 처음이면 Expo 계정으로 로그인해야 할 수 있다.

```bash
npx expo login
npx expo start
```

폰에 Expo Go 앱을 설치하고 터미널의 QR 코드를 찍으면 앱이 열린다.

- Android: Expo Go 첫 화면의 "Scan QR code"를 누른다.
- iPhone: 기본 카메라 앱으로 QR 코드를 비춘다.

컴퓨터와 폰은 같은 와이파이에 있어야 한다. 연결이 안 되면 `npx expo start --tunnel`로 켠다. 화면이 예전 그대로면 `npx expo start -c`로 캐시를 비우고 다시 켠다.

웹 브라우저 실행은 지원하지 않는다. react-native-web을 설치하지 않았기 때문이다.

## 테스트

```bash
npm test          # 전체 테스트
npx tsc --noEmit  # 타입 검사
```

날짜 계산, 공휴일, 일정 규칙, 디데이, 저장은 화면과 분리된 함수로 두고 테스트한다. 화면은 주요 흐름만 테스트한다.

## APK 빌드

[expo.dev](https://expo.dev)에서 무료 계정을 만든 뒤 실행한다.

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

- 처음 빌드하기 전에 공휴일 API 키를 EAS에도 등록한다. `.env`는 빌드 서버로 올라가지 않기 때문이다. `npx eas-cli@latest env:set --name EXPO_PUBLIC_HOLIDAY_API_KEY --value 발급받은키 --environment preview --visibility sensitive`
- `preview` 프로필은 폰에 바로 설치할 수 있는 APK를 만든다. 설정은 `eas.json`에 있다.
- 처음 빌드할 때 서명 키를 만들지 물으면 "예"를 고른다. 키는 Expo가 보관하고, 업데이트 APK도 같은 키로 서명해야 기존 앱 위에 덮어 설치된다.
- 빌드가 끝나면 나오는 링크나 QR 코드로 APK를 받아 설치한다. 폰에서 "출처를 알 수 없는 앱 설치"를 허용해야 한다.

iOS 앱은 Mac의 Xcode나 Apple 유료 개발자 계정이 있어야 빌드할 수 있다. Windows에서는 Expo Go로만 확인할 수 있다.

### 개발용 빌드 (위젯 확인용)

홈 화면 위젯은 Expo Go에 없는 네이티브 부품이라, 개발용 빌드를 한 번 설치해서 확인한다. 개발용 빌드는 이 앱 전용 Expo Go라고 보면 된다.

```bash
npx eas-cli@latest env:set --name EXPO_PUBLIC_HOLIDAY_API_KEY --value 발급받은키 --environment development --visibility sensitive   # 처음 한 번
npx eas-cli@latest build -p android --profile development
npx expo start --dev-client --port 8082
```

- 빌드가 끝나면 받은 APK를 설치하고, 그 앱을 열어 `expo start`의 QR 코드를 찍거나 목록에서 고른다.
- 그 뒤로는 코드를 고치면 바로 반영된다. 위젯 설정(`app.json`)이나 네이티브 라이브러리를 바꿨을 때만 다시 빌드한다.
- 개발용 빌드와 preview APK는 같은 패키지 이름이라, 한 폰에는 둘 중 하나만 설치된다.

## 폴더 구조

```
app/                 화면 (expo-router 파일 기반 라우팅)
  _layout.tsx        글꼴, 테마, 데이터를 준비하고 시작 화면을 닫는다
  index.tsx          홈
  calendar.tsx       월간 달력
  settings.tsx       설정 (테마, 디데이, 백업)
src/
  lib/               화면과 분리된 규칙 (날짜, 일정 반복, 디데이, 공휴일 API, 백업 형식, 아이콘, 막대 층 배치)
  data/holidays.ts   API를 못 받았을 때 쓰는 공휴일 표 (2026~2027)
  store/             AsyncStorage 저장, 앱 데이터 Context, 공휴일 Context
  theme/             색상 팔레트, 글꼴, 테마 Context
  components/        화면 부품 (달력 칸, 일정 추가 창, 시간 휠 등)
scripts/make-icons.mjs  앱 아이콘과 시작 화면 이미지를 만든다
assets/              아이콘과 시작 화면 이미지
```

## 유지보수

- **공휴일.** 앱이 API에서 올해와 내년을 받아 오므로 해마다 손볼 필요는 없다. API에는 정부가 발표한 해까지만 있어서, 발표 전인 해는 일요일만 빨강으로 보이다가 발표되면 자동으로 채워진다. `src/data/holidays.ts`는 인터넷이 없을 때 쓰는 예비 표다.
- **아이콘 추가.** `src/lib/icons.ts`의 `ICONS`에 한 줄 추가한다. 이름은 MaterialCommunityIcons에 있는 것이어야 하고, 색은 정해진 파스텔 색 중에서 고른다.
- **앱 아이콘 다시 만들기.** `scripts/make-icons.mjs`를 고친 뒤 `node scripts/make-icons.mjs`를 실행한다.
- **앱 이름과 ID.** 앱 이름은 `하루조각`(예전 이름 슈수슈수), Android 패키지는 `com.yeonjae.calendar`이고 `app.json`에 있다. 패키지 이름은 앱 이름과 상관없게 지었으니, 이름이 바뀌어도 그대로 둔다. 바꾸면 폰이 다른 앱으로 인식해서 데이터가 이어지지 않는다(예전 패키지 `com.yeonjae.shusushusu`로 설치한 앱의 데이터는 백업 내보내기 → 가져오기로 옮긴다). 백업 파일 안의 `app: 'shusushusu'` 값은 예전 백업을 읽기 위해 바꾸지 않는다.
