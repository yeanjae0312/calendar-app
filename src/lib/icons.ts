import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type Glyph = ComponentProps<typeof MaterialCommunityIcons>['name'];
export type Tint = 'mint' | 'pink' | 'butter' | 'sky' | 'lav' | 'peach' | 'sage';
export type IconDef = { label: string; tint: Tint; glyph: Glyph };

// 색은 아이콘마다 고정이다. 새 아이콘은 여기에 한 줄 추가하고 ICON_GROUPS의 알맞은 묶음에도 넣는다.
// 키는 저장된 일정이 가리키므로 한 번 쓴 키는 바꾸거나 지우지 않는다.
export const ICONS = {
  people: { label: '약속', tint: 'mint', glyph: 'account-group-outline' },
  cup: { label: '카페', tint: 'mint', glyph: 'coffee-outline' },
  food: { label: '식사', tint: 'peach', glyph: 'silverware-fork-knife' },
  cake: { label: '생일', tint: 'peach', glyph: 'cake-variant-outline' },
  heart: { label: '사랑', tint: 'pink', glyph: 'heart-outline' },
  gift: { label: '기념일', tint: 'pink', glyph: 'gift-outline' },
  bag: { label: '쇼핑', tint: 'butter', glyph: 'shopping-outline' },
  music: { label: '공연', tint: 'butter', glyph: 'music-note' },
  plane: { label: '여행', tint: 'sky', glyph: 'airplane' },
  car: { label: '이동', tint: 'sky', glyph: 'car-outline' },
  hospital: { label: '병원', tint: 'sky', glyph: 'hospital-box-outline' },
  pill: { label: '약', tint: 'sky', glyph: 'pill' },
  work: { label: '업무', tint: 'lav', glyph: 'briefcase-outline' },
  book: { label: '공부', tint: 'lav', glyph: 'book-open-variant' },
  gym: { label: '운동', tint: 'sage', glyph: 'dumbbell' },
  home: { label: '집', tint: 'sage', glyph: 'home-outline' },

  phone: { label: '전화', tint: 'mint', glyph: 'phone-outline' },
  mail: { label: '연락', tint: 'mint', glyph: 'email-outline' },
  alarm: { label: '알람', tint: 'mint', glyph: 'alarm' },
  star: { label: '중요', tint: 'butter', glyph: 'star-outline' },
  flag: { label: '마감', tint: 'pink', glyph: 'flag-outline' },
  event: { label: '행사', tint: 'mint', glyph: 'calendar-star' },
  beer: { label: '술자리', tint: 'peach', glyph: 'glass-mug-variant' },
  wine: { label: '와인', tint: 'pink', glyph: 'glass-wine' },
  pizza: { label: '배달', tint: 'peach', glyph: 'pizza' },
  noodle: { label: '면', tint: 'peach', glyph: 'noodles' },
  burger: { label: '패스트푸드', tint: 'peach', glyph: 'hamburger' },
  icecream: { label: '디저트', tint: 'pink', glyph: 'ice-cream' },
  cooking: { label: '요리', tint: 'peach', glyph: 'bowl-mix-outline' },
  movie: { label: '영화', tint: 'butter', glyph: 'movie-open-outline' },
  popcorn: { label: '극장', tint: 'butter', glyph: 'popcorn' },
  tv: { label: '드라마', tint: 'butter', glyph: 'television-classic' },
  game: { label: '게임', tint: 'butter', glyph: 'gamepad-variant-outline' },
  camera: { label: '사진', tint: 'butter', glyph: 'camera-outline' },
  palette: { label: '취미', tint: 'butter', glyph: 'palette-outline' },
  mic: { label: '노래방', tint: 'butter', glyph: 'microphone-outline' },
  guitar: { label: '악기', tint: 'butter', glyph: 'guitar-acoustic' },
  reading: { label: '독서', tint: 'lav', glyph: 'book-outline' },
  party: { label: '파티', tint: 'pink', glyph: 'party-popper' },
  train: { label: '기차', tint: 'sky', glyph: 'train' },
  subway: { label: '지하철', tint: 'sky', glyph: 'subway-variant' },
  bus: { label: '버스', tint: 'sky', glyph: 'bus' },
  ferry: { label: '배', tint: 'sky', glyph: 'ferry' },
  beach: { label: '바다', tint: 'sky', glyph: 'beach' },
  tent: { label: '캠핑', tint: 'sage', glyph: 'tent' },
  mountain: { label: '등산', tint: 'sage', glyph: 'image-filter-hdr' },
  bed: { label: '숙소', tint: 'lav', glyph: 'bed-outline' },
  tooth: { label: '치과', tint: 'sky', glyph: 'tooth-outline' },
  checkup: { label: '검진', tint: 'sky', glyph: 'stethoscope' },
  shot: { label: '주사', tint: 'sky', glyph: 'needle' },
  health: { label: '건강', tint: 'pink', glyph: 'heart-pulse' },
  spa: { label: '휴식', tint: 'lav', glyph: 'spa-outline' },
  sleep: { label: '잠', tint: 'lav', glyph: 'weather-night' },
  run: { label: '러닝', tint: 'sage', glyph: 'run' },
  yoga: { label: '요가', tint: 'sage', glyph: 'yoga' },
  swim: { label: '수영', tint: 'sky', glyph: 'swim' },
  bike: { label: '자전거', tint: 'sage', glyph: 'bike' },
  soccer: { label: '축구', tint: 'sage', glyph: 'soccer' },
  baseball: { label: '야구', tint: 'sage', glyph: 'baseball' },
  basketball: { label: '농구', tint: 'peach', glyph: 'basketball' },
  tennis: { label: '테니스', tint: 'sage', glyph: 'tennis' },
  golf: { label: '골프', tint: 'sage', glyph: 'golf' },
  meeting: { label: '회의', tint: 'lav', glyph: 'account-tie-outline' },
  laptop: { label: '작업', tint: 'lav', glyph: 'laptop' },
  school: { label: '학교', tint: 'lav', glyph: 'school-outline' },
  exam: { label: '시험', tint: 'lav', glyph: 'pencil-outline' },
  money: { label: '월급', tint: 'butter', glyph: 'cash' },
  card: { label: '결제', tint: 'butter', glyph: 'credit-card-outline' },
  bank: { label: '은행', tint: 'sage', glyph: 'bank-outline' },
  cart: { label: '장보기', tint: 'butter', glyph: 'cart-outline' },
  cleaning: { label: '청소', tint: 'sage', glyph: 'broom' },
  laundry: { label: '빨래', tint: 'sky', glyph: 'washing-machine' },
  plant: { label: '식물', tint: 'sage', glyph: 'sprout-outline' },
  pet: { label: '반려동물', tint: 'peach', glyph: 'paw' },
  dog: { label: '산책', tint: 'peach', glyph: 'dog' },
  haircut: { label: '미용실', tint: 'lav', glyph: 'content-cut' },
  ring: { label: '결혼식', tint: 'pink', glyph: 'ring' },
  baby: { label: '아기', tint: 'pink', glyph: 'baby-face-outline' },
  family: { label: '가족', tint: 'mint', glyph: 'human-male-female-child' },
  couple: { label: '데이트', tint: 'pink', glyph: 'account-heart-outline' },
  memorial: { label: '기일', tint: 'lav', glyph: 'flower-tulip-outline' },
  church: { label: '종교', tint: 'lav', glyph: 'church' },
} as const satisfies Record<string, IconDef>;

export type IconKey = keyof typeof ICONS;
export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

// 아이콘 선택기에서 보여 줄 묶음과 순서.
export const ICON_GROUPS: { label: string; keys: IconKey[] }[] = [
  { label: '일상', keys: ['people', 'cup', 'phone', 'mail', 'alarm', 'star', 'flag', 'event'] },
  { label: '음식', keys: ['food', 'beer', 'wine', 'pizza', 'noodle', 'burger', 'icecream', 'cooking'] },
  { label: '여가', keys: ['music', 'movie', 'popcorn', 'tv', 'game', 'camera', 'palette', 'mic', 'guitar', 'reading', 'party', 'bag'] },
  { label: '여행', keys: ['plane', 'car', 'train', 'subway', 'bus', 'ferry', 'beach', 'tent', 'mountain', 'bed'] },
  {
    label: '건강',
    keys: ['hospital', 'pill', 'tooth', 'checkup', 'shot', 'health', 'spa', 'sleep', 'gym', 'run', 'yoga', 'swim', 'bike', 'soccer', 'baseball', 'basketball', 'tennis', 'golf'],
  },
  { label: '일·공부', keys: ['work', 'book', 'meeting', 'laptop', 'school', 'exam', 'money', 'card', 'bank'] },
  { label: '생활', keys: ['home', 'cart', 'cleaning', 'laundry', 'plant', 'pet', 'dog', 'haircut'] },
  { label: '기념일', keys: ['cake', 'heart', 'gift', 'ring', 'baby', 'family', 'couple', 'memorial', 'church'] },
];

export const iconOf = (key: string): IconDef => (ICONS as Record<string, IconDef>)[key] ?? ICONS.people;
