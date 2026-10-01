import sharp from 'sharp';

// 파스텔 초록 바탕에 흰 달력, 진초록 머리띠, 핑크 점 하나.
const glyph = (mono = false) => {
  const white = '#FFFFFF';
  const head = mono ? white : '#3E8A66';
  const ring = mono ? white : '#2E3B33';
  const dot = mono ? white : '#CFE9DA';
  const pink = mono ? white : '#F4B3C0';
  const dots = [-120, 0, 120].flatMap((x) => [-10, 90].map((y) => [x, y]));
  return `<g transform="translate(512 540)">
    <rect x="-230" y="-210" width="460" height="420" rx="72" fill="${white}"/>
    <path d="M-230 -110 v-28 a72 72 0 0 1 72 -72 h316 a72 72 0 0 1 72 72 v28 z" fill="${head}"/>
    <rect x="-130" y="-262" width="40" height="110" rx="20" fill="${ring}"/>
    <rect x="90" y="-262" width="40" height="110" rx="20" fill="${ring}"/>
    ${mono ? '' : dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="30" fill="${x === 120 && y === 90 ? pink : dot}"/>`).join('')}
  </g>`;
};

const svg = (bg, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${bg ? `<rect width="1024" height="1024" fill="${bg}"/>` : ''}${body}</svg>`;

const GREEN = '#9ED6B8';
const files = {
  'assets/icon.png': svg(GREEN, glyph()),
  'assets/android-icon-foreground.png': svg(null, glyph()),
  'assets/android-icon-background.png': svg(GREEN, ''),
  'assets/android-icon-monochrome.png': svg(null, glyph(true)),
  'assets/splash-icon.png': svg(null, glyph()),
};

for (const [file, s] of Object.entries(files)) {
  await sharp(Buffer.from(s)).png().toFile(file);
  console.log('만듦:', file);
}
