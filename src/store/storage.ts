import AsyncStorage from '@react-native-async-storage/async-storage';

export type Loaded<T> = { ok: boolean; value: T };

// ok가 false면 저장소를 읽지 못한 것이다. 이때는 기존 데이터를 덮어쓰면 안 된다.
export async function loadJSON<T>(key: string, fallback: T): Promise<Loaded<T>> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(key);
  } catch (e) {
    console.warn(`불러오지 못했어요: ${key}`, e);
    return { ok: false, value: fallback };
  }
  if (raw == null) return { ok: true, value: fallback };
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch {
    // 깨진 원본은 따로 남겨 두고 새로 시작한다.
    await AsyncStorage.setItem(`${key}.corrupt`, raw).catch(() => {});
    return { ok: true, value: fallback };
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`저장하지 못했어요: ${key}`, e);
  }
}
