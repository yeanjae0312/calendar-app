# 슈수슈수

파스텔 초록 느낌의 간단한 달력 앱이다. Expo(React Native)로 만들었고, Android APK로 배포하는 것을 목표로 한다. 데이터는 서버 없이 폰 안에만 저장한다.

## 주요 기능

- **홈 요약.** 디데이, 오늘 일정, 다가오는 일정, 이번 달 일정 수를 한눈에 보여 준다.
- **월간 달력.** 일요일과 공휴일은 빨강, 토요일은 파랑으로 표시한다. 하루 일정은 작은 아이콘으로, 여러 날 일정은 막대로 보여 준다. 겹치는 막대는 두 층까지 보이고, 넘치면 "+N"이 붙는다.
- **일정 등록.** 제목, 시작과 종료 날짜·시간, 하루 종일, 매년 반복, 아이콘을 정할 수 있다. 날짜와 시간은 아이폰 캘린더처럼 창 안에 펼쳐지는 달력과 휠로 고른다.
- **아이콘.** 16개 아이콘 중에서 고른다. 색은 아이콘마다 정해져 있다.
- **디데이.** 여러 개를 등록할 수 있고, 첫날을 1일로 셀지 0일로 셀지 디데이마다 고를 수 있다.
- **테마.** 라이트, 다크, 폰 설정 따르기 중에서 고른다.

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

- `preview` 프로필은 폰에 바로 설치할 수 있는 APK를 만든다. 설정은 `eas.json`에 있다.
- 처음 빌드할 때 서명 키를 만들지 물으면 "예"를 고른다. 키는 Expo가 보관하고, 업데이트 APK도 같은 키로 서명해야 기존 앱 위에 덮어 설치된다.
- 빌드가 끝나면 나오는 링크나 QR 코드로 APK를 받아 설치한다. 폰에서 "출처를 알 수 없는 앱 설치"를 허용해야 한다.

iOS 앱은 Mac의 Xcode나 Apple 유료 개발자 계정이 있어야 빌드할 수 있다. Windows에서는 Expo Go로만 확인할 수 있다.

## 폴더 구조

```
app/                 화면 (expo-router 파일 기반 라우팅)
  _layout.tsx        글꼴, 테마, 데이터를 준비하고 시작 화면을 닫는다
  index.tsx          홈
  calendar.tsx       월간 달력
  settings.tsx       설정 (테마, 디데이)
src/
  lib/               화면과 분리된 규칙 (날짜, 일정, 디데이, 공휴일, 아이콘, 막대 층 배치)
  data/holidays.ts   공휴일 목록
  store/             AsyncStorage 저장과 앱 데이터 Context
  theme/             색상 팔레트, 글꼴, 테마 Context
  components/        화면 부품 (달력 칸, 일정 추가 창, 시간 휠 등)
scripts/make-icons.mjs  앱 아이콘과 시작 화면 이미지를 만든다
assets/              아이콘과 시작 화면 이미지
```

## 유지보수

- **공휴일.** `src/data/holidays.ts`에는 2026년과 2027년만 들어 있다. 해마다 우주항공청 월력요항이 나오면 다음 해를 추가한다. 목록에 없는 해는 일요일만 빨강으로 보인다.
- **아이콘 추가.** `src/lib/icons.ts`의 `ICONS`에 한 줄 추가한다. 이름은 MaterialCommunityIcons에 있는 것이어야 하고, 색은 정해진 파스텔 색 중에서 고른다.
- **앱 아이콘 다시 만들기.** `scripts/make-icons.mjs`를 고친 뒤 `node scripts/make-icons.mjs`를 실행한다.
- **앱 이름과 ID.** 앱 이름은 `슈수슈수`, Android 패키지는 `com.yeonjae.shusushusu`이고 `app.json`에 있다. 패키지 이름은 한 번 배포한 뒤에는 바꾸지 않는다. 바꾸면 폰이 다른 앱으로 인식한다.
