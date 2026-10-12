import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { DayDeco, Days, toggleSticker, updateDay } from '../lib/days';
import type { DDay } from '../lib/dday';
import { CalEvent, normalizeEvent, StoredEvent } from '../lib/events';
import { loadJSON, saveJSON } from './storage';

type AppData = {
  ready: boolean;
  events: CalEvent[];
  ddays: DDay[];
  days: Days;
  saveEvent: (e: CalEvent) => void;
  deleteEvent: (id: string) => void;
  saveDDay: (d: DDay) => void;
  deleteDDay: (id: string) => void;
  saveDay: (k: string, patch: DayDeco) => void;
  toggleSticker: (k: string, sticker: string) => void;
  replaceAll: (events: CalEvent[], ddays: DDay[], days?: Days) => void;
};

const Ctx = createContext<AppData | null>(null);

export function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [ddays, setDDays] = useState<DDay[]>([]);
  const [days, setDays] = useState<Days>({});
  const [writable, setWritable] = useState({ events: false, ddays: false, days: false });

  useEffect(() => {
    Promise.all([loadJSON<StoredEvent[]>('events', []), loadJSON<DDay[]>('ddays', []), loadJSON<Days>('days', {})]).then(([e, d, dy]) => {
      setEvents(e.value.map(normalizeEvent));
      setDDays(d.value);
      setDays(dy.value);
      setWritable({ events: e.ok, ddays: d.ok, days: dy.ok });
      setReady(true);
    });
  }, []);

  // 불러오기가 끝나기 전이나 읽기에 실패했을 때는 저장하지 않는다. 그래야 기존 데이터를 빈 목록으로 덮어쓰지 않는다.
  useEffect(() => {
    if (ready && writable.events) saveJSON('events', events);
  }, [ready, writable.events, events]);
  useEffect(() => {
    if (ready && writable.ddays) saveJSON('ddays', ddays);
  }, [ready, writable.ddays, ddays]);
  useEffect(() => {
    if (ready && writable.days) saveJSON('days', days);
  }, [ready, writable.days, days]);

  const value = useMemo<AppData>(
    () => ({
      ready,
      events,
      ddays,
      days,
      saveEvent: (e) => setEvents((l) => upsert(l, e)),
      deleteEvent: (id) => setEvents((l) => l.filter((x) => x.id !== id)),
      saveDDay: (d) => setDDays((l) => upsert(l, d)),
      deleteDDay: (id) => setDDays((l) => l.filter((x) => x.id !== id)),
      // 백업에서 되살릴 때. 읽기에 실패했던 저장소도 사용자가 고른 내용으로 덮어쓴다.
      saveDay: (k, patch) => setDays((x) => updateDay(x, k, patch)),
      toggleSticker: (k, s) => setDays((x) => toggleSticker(x, k, s)),
      replaceAll: (e, d, dy = {}) => {
        setEvents(e);
        setDDays(d);
        setDays(dy);
        setWritable({ events: true, ddays: true, days: true });
      },
    }),
    [ready, events, ddays, days],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData(): AppData {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppData는 AppDataProvider 안에서 써야 해요');
  return v;
}
