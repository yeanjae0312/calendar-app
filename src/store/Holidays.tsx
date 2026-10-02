import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { HOLIDAYS } from '../data/holidays';
import { fetchYear, HolidayCache, HolidayMap, mergeHolidays, needsFetch } from '../lib/holidayApi';
import { loadJSON, saveJSON } from './storage';

// Provider 밖(컴포넌트 단위 테스트)에서는 번들 표를 쓴다.
const Ctx = createContext<HolidayMap>(HOLIDAYS);

type Props = { children: ReactNode; apiKey?: string; fetchFn?: typeof fetch; now?: () => number };

// 번들 표로 바로 시작하고, 저장해 둔 공휴일과 새로 받은 공휴일로 차례로 바꾼다. 시작 화면은 기다리지 않는다.
export function HolidayProvider({ children, apiKey = process.env.EXPO_PUBLIC_HOLIDAY_API_KEY, fetchFn = fetch, now = Date.now }: Props) {
  const [map, setMap] = useState<HolidayMap>(HOLIDAYS);

  useEffect(() => {
    let alive = true;
    (async () => {
      const loaded = await loadJSON<HolidayCache>('holidays', {});
      let cache = loaded.value;
      if (alive) setMap(mergeHolidays(HOLIDAYS, cache));
      if (!apiKey) return;
      const t = now();
      const y = new Date(t).getFullYear();
      let changed = false;
      for (const year of [y, y + 1]) {
        if (!needsFetch(cache, year, t)) continue;
        const days = await fetchYear(year, apiKey, fetchFn);
        if (!days) continue;
        cache = { ...cache, [year]: { fetchedAt: t, days } };
        changed = true;
      }
      if (!changed) return;
      // 저장소를 읽지 못했으면 덮어쓰지 않는다.
      if (loaded.ok) await saveJSON('holidays', cache);
      if (alive) setMap(mergeHolidays(HOLIDAYS, cache));
    })();
    return () => {
      alive = false;
    };
  }, [apiKey, fetchFn, now]);

  return <Ctx.Provider value={map}>{children}</Ctx.Provider>;
}

export const useHolidays = () => useContext(Ctx);
