import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { DateKey, toKey } from './date';

function msUntilNextDay(now: Date) {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

// 앱을 켜 둔 채 자정이 지나거나, 다음 날 앱으로 돌아오면 오늘 날짜를 새로 읽는다.
export function useToday(): DateKey {
  const [today, setToday] = useState(() => toKey(new Date()));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      setToday(toKey(new Date()));
      clearTimeout(timer);
      timer = setTimeout(refresh, msUntilNextDay(new Date()) + 1000);
    };
    refresh();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') refresh();
    });
    return () => {
      clearTimeout(timer);
      sub.remove();
    };
  }, []);

  return today;
}
