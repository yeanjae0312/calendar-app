import { fetchYear, mergeHolidays, needsFetch, parseRestDe, WEEK_MS } from './holidayApi';

// 응답 모양은 2026-10-01 실제 호출 결과를 따른다.
const wrap = (items: unknown) => ({ response: { header: { resultCode: '00', resultMsg: 'NORMAL SERVICE.' }, body: { items, totalCount: 0 } } });
const item = (locdate: number, dateName: string, isHoliday = 'Y') => ({ dateKind: '01', dateName, isHoliday, locdate, seq: 1 });

test('여러 개는 배열, 하나는 객체, 없으면 빈 문자열로 온다', () => {
  expect(parseRestDe(wrap({ item: [item(20270101, '1월1일'), item(20270209, '대체공휴일(설날)')] })))
    .toEqual({ '2027-01-01': '신정', '2027-02-09': '대체공휴일(설날)' });
  expect(parseRestDe(wrap({ item: item(20261225, '기독탄신일') }))).toEqual({ '2026-12-25': '성탄절' });
  expect(parseRestDe(wrap(''))).toEqual({});
});

test('공휴일이 아닌 날은 빼고, 같은 날 두 공휴일은 이어 붙인다', () => {
  expect(parseRestDe(wrap({ item: [item(20270505, '어린이날'), item(20270505, '부처님오신날'), item(20270715, '기념일', 'N')] })))
    .toEqual({ '2027-05-05': '어린이날 · 부처님오신날' });
});

test('오류 응답은 null', () => {
  expect(parseRestDe({ response: { header: { resultCode: '30', resultMsg: 'SERVICE_KEY_IS_NOT_REGISTERED_ERROR' } } })).toBeNull();
  expect(parseRestDe('garbage')).toBeNull();
});

test('fetchYear는 키와 연도를 담아 부르고, 실패하면 null', async () => {
  const ok = jest.fn(async (_url: string) => ({ ok: true, json: async () => wrap({ item: item(20280101, '1월1일') }) }));
  expect(await fetchYear(2028, 'a+b/c', ok as never)).toEqual({ '2028-01-01': '신정' });
  const url = ok.mock.calls[0][0];
  expect(url).toContain('solYear=2028');
  expect(url).toContain('numOfRows=100');
  expect(url).toContain('_type=json');
  expect(url).toContain('serviceKey=a%2Bb%2Fc');
  expect(await fetchYear(2028, 'k', (async () => { throw new Error('offline'); }) as never)).toBeNull();
  expect(await fetchYear(2028, 'k', (async () => ({ ok: true, json: async () => { throw new SyntaxError('xml'); } })) as never)).toBeNull();
  expect(await fetchYear(2028, 'k', (async () => ({ ok: false, json: async () => ({}) })) as never)).toBeNull();
});

test('needsFetch는 없거나 7일 지난 해만 true', () => {
  const now = 1_000_000_000_000;
  expect(needsFetch({}, 2028, now)).toBe(true);
  expect(needsFetch({ 2028: { fetchedAt: now - WEEK_MS + 1, days: {} } }, 2028, now)).toBe(false);
  expect(needsFetch({ 2028: { fetchedAt: now - WEEK_MS - 1, days: {} } }, 2028, now)).toBe(true);
});

test('mergeHolidays는 받아 온 해를 번들 표보다 우선하고, 빈 해는 번들을 남긴다', () => {
  const bundled = { '2027-01-01': '신정', '2027-06-03': '옛날값', '2026-01-01': '신정' };
  const cache = { 2027: { fetchedAt: 0, days: { '2027-01-01': '신정' } }, 2026: { fetchedAt: 0, days: {} } };
  expect(mergeHolidays(bundled, cache)).toEqual({ '2027-01-01': '신정', '2026-01-01': '신정' });
});
