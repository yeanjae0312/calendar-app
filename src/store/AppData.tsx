import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { DDay } from '../lib/dday';
import type { CalEvent } from '../lib/events';
import { loadJSON, saveJSON } from './storage';

type AppData = {
  ready: boolean;
  events: CalEvent[];
  ddays: DDay[];
  saveEvent: (e: CalEvent) => void;
  deleteEvent: (id: string) => void;
  saveDDay: (d: DDay) => void;
  deleteDDay: (id: string) => void;
};

const Ctx = createContext<AppData | null>(null);

export function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [ddays, setDDays] = useState<DDay[]>([]);
  const [writable, setWritable] = useState({ events: false, ddays: false });

  useEffect(() => {
    Promise.all([loadJSON<CalEvent[]>('events', []), loadJSON<DDay[]>('ddays', [])]).then(([e, d]) => {
      setEvents(e.value);
      setDDays(d.value);
      setWritable({ events: e.ok, ddays: d.ok });
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

  const value = useMemo<AppData>(
    () => ({
      ready,
      events,
      ddays,
      saveEvent: (e) => setEvents((l) => upsert(l, e)),
      deleteEvent: (id) => setEvents((l) => l.filter((x) => x.id !== id)),
      saveDDay: (d) => setDDays((l) => upsert(l, d)),
      deleteDDay: (id) => setDDays((l) => l.filter((x) => x.id !== id)),
    }),
    [ready, events, ddays],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData(): AppData {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppData는 AppDataProvider 안에서 써야 해요');
  return v;
}
