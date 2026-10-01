import { CalEvent, countInMonth, coveringStart, dayLabel, describeWhen, eventsOn, makeEvent, occurrenceIn, upcoming } from './events';

const ev = (p: Partial<CalEvent>): CalEvent => ({
  id: 'x', title: '일정', date: '2026-10-17', time: null, icon: 'people', yearly: false, ...p,
});

describe('occurrenceIn', () => {
  test('한 번만 있는 일정은 그 해에만 있다', () => {
    expect(occurrenceIn(ev({}), 2026)).toBe('2026-10-17');
    expect(occurrenceIn(ev({}), 2027)).toBeNull();
  });
  test('매년 일정은 등록한 해부터 해마다 있다', () => {
    const e = ev({ date: '2024-10-14', yearly: true });
    expect(occurrenceIn(e, 2026)).toBe('2026-10-14');
    expect(occurrenceIn(e, 2023)).toBeNull();
  });
  test('2월 29일 매년 일정은 평년에 2월 28일로 보인다', () => {
    const e = ev({ date: '2024-02-29', yearly: true });
    expect(occurrenceIn(e, 2025)).toBe('2025-02-28');
    expect(occurrenceIn(e, 2028)).toBe('2028-02-29');
  });
});

test('eventsOn은 그날 일정을 하루 종일 먼저, 그다음 시간 순서로 준다', () => {
  const list = [
    ev({ id: 'b', time: '18:00' }), ev({ id: 'a', time: '07:00' }),
    ev({ id: 'c', time: null }), ev({ id: 'z', date: '2026-10-18' }),
  ];
  expect(eventsOn(list, '2026-10-17').map((e) => e.id)).toEqual(['c', 'a', 'b']);
});

test('countInMonth는 매년 일정도 센다', () => {
  const list = [ev({}), ev({ date: '2020-10-01', yearly: true }), ev({ date: '2026-11-01' })];
  expect(countInMonth(list, 2026, 10)).toBe(2);
});

describe('upcoming', () => {
  const today = '2026-10-30';
  test('오늘 다음 날부터 가까운 순서로, 남은 날 수와 함께 준다', () => {
    const list = [
      ev({ id: 'past', date: '2026-10-01' }), ev({ id: 'today', date: today }),
      ev({ id: 'far', date: '2026-11-21' }), ev({ id: 'bday', date: '2025-11-07', yearly: true }),
    ];
    expect(upcoming(list, today, 3)).toEqual([
      { event: list[3], date: '2026-11-07', daysLeft: 8 },
      { event: list[2], date: '2026-11-21', daysLeft: 22 },
    ]);
  });
  test('올해 이미 지난 매년 일정은 내년 날짜로 준다', () => {
    expect(upcoming([ev({ date: '2020-01-05', yearly: true })], today, 3)[0].date).toBe('2027-01-05');
  });
  test('몇 년 뒤 일정도 빠지지 않는다', () => {
    expect(upcoming([ev({ date: '2029-03-01' })], today, 3)[0].date).toBe('2029-03-01');
    expect(upcoming([ev({ date: '2029-03-01', yearly: true })], today, 3)[0].date).toBe('2029-03-01');
  });
  test('개수를 제한한다', () => {
    const list = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'].map((date, i) => ev({ id: String(i), date }));
    expect(upcoming(list, today, 3)).toHaveLength(3);
  });
});

describe('makeEvent', () => {
  const base = { title: '  치과  ', date: '2026-10-02', allDay: false, time: '14:00', endTime: '15:00', icon: 'hospital' as const, yearly: false };
  test('제목 앞뒤 공백을 지우고 새 id를 붙인다', () => {
    expect(makeEvent(base, () => 'new')).toEqual({
      id: 'new', title: '치과', date: '2026-10-02', time: '14:00', endTime: '15:00', icon: 'hospital', yearly: false,
    });
  });
  test('하루 종일이면 시작과 종료 시간은 null이다', () => {
    const e = makeEvent({ ...base, allDay: true }, () => 'n');
    expect(e?.time).toBeNull();
    expect(e?.endTime).toBeNull();
  });
  test('종료가 시작보다 늦지 않으면 종료 시간을 버린다', () => {
    expect(makeEvent({ ...base, endTime: '14:00' }, () => 'n')?.endTime).toBeNull();
    expect(makeEvent({ ...base, endTime: '13:00' }, () => 'n')?.endTime).toBeNull();
  });
  test('수정할 때는 원래 id를 유지한다', () => {
    expect(makeEvent({ ...base, id: 'old' }, () => 'new')?.id).toBe('old');
  });
  test('제목이 비었거나 공백뿐이면 만들지 않는다', () => {
    expect(makeEvent({ ...base, title: '   ' }, () => 'n')).toBeNull();
  });
});

describe('여러 날 일정', () => {
  const trip = ev({ id: 'trip', date: '2026-10-16', endDate: '2026-10-19' });

  test('걸친 모든 날에 나오고, 그 밖의 날에는 없다', () => {
    expect(eventsOn([trip], '2026-10-15')).toEqual([]);
    expect(eventsOn([trip], '2026-10-16')).toEqual([trip]);
    expect(eventsOn([trip], '2026-10-18')).toEqual([trip]);
    expect(eventsOn([trip], '2026-10-19')).toEqual([trip]);
    expect(eventsOn([trip], '2026-10-20')).toEqual([]);
  });

  test('coveringStart는 그날을 덮는 회차의 시작일을 준다', () => {
    expect(coveringStart(trip, '2026-10-18')).toBe('2026-10-16');
    expect(coveringStart(trip, '2026-10-20')).toBeNull();
  });

  test('매년 반복하면 해마다 같은 기간에 나오고, 연말에서 연초로 넘어가도 이어진다', () => {
    const newYear = ev({ date: '2025-12-30', endDate: '2026-01-02', yearly: true });
    expect(coveringStart(newYear, '2027-01-01')).toBe('2026-12-30');
    expect(coveringStart(newYear, '2026-12-31')).toBe('2026-12-30');
    expect(eventsOn([newYear], '2026-01-03')).toEqual([]);
  });

  test('몇째 날인지 알려 주고, 하루 일정은 알려 주지 않는다', () => {
    expect(dayLabel(trip, '2026-10-16')).toBe('첫날');
    expect(dayLabel(trip, '2026-10-18')).toBe('3일째');
    expect(dayLabel(trip, '2026-10-19')).toBe('마지막 날');
    expect(dayLabel(ev({}), '2026-10-17')).toBeNull();
  });

  test('달과 겹치면 그 달 일정으로 센다', () => {
    const cross = ev({ date: '2026-09-29', endDate: '2026-10-02' });
    expect(countInMonth([cross], 2026, 9)).toBe(1);
    expect(countInMonth([cross], 2026, 10)).toBe(1);
    expect(countInMonth([cross], 2026, 11)).toBe(0);
  });

  test('언제인지 한 줄로 보여 준다', () => {
    expect(describeWhen(trip, '2026-10-16')).toBe('10월 16일 ~ 10월 19일 · 하루 종일');
    const camp = ev({ date: '2026-10-18', endDate: '2026-10-19', time: '14:00', endTime: '11:00' });
    expect(describeWhen(camp, '2026-10-18')).toBe('10월 18일 오후 2:00 ~ 10월 19일 오전 11:00');
    const dentist = ev({ date: '2026-10-02', time: '14:00', endTime: '15:00' });
    expect(describeWhen(dentist, '2026-10-02')).toBe('오후 2:00 ~ 오후 3:00');
    expect(describeWhen(dentist, '2026-10-02', true)).toBe('10월 2일 금 · 오후 2:00 ~ 오후 3:00');
  });

  test('makeEvent는 종료 날짜를 시작 뒤일 때만 저장하고, 여러 날이면 종료 시간이 시작보다 일러도 된다', () => {
    const base = { title: '캠핑', date: '2026-10-18', allDay: false, time: '14:00', endTime: '11:00', icon: 'people' as const, yearly: false };
    expect(makeEvent({ ...base, endDate: '2026-10-19' }, () => 'n')).toMatchObject({ endDate: '2026-10-19', endTime: '11:00' });
    expect(makeEvent({ ...base, endDate: '2026-10-18' }, () => 'n')).not.toHaveProperty('endDate');
    expect(makeEvent({ ...base, endDate: '2026-10-10' }, () => 'n')).not.toHaveProperty('endDate');
  });
});
