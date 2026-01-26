import { Show, TrackerState, UserProfile } from "@movie-tracker/core";

// NOTE: AsyncStorage is asynchronous; all methods below return Promises
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "series-tracker";

async function read(): Promise<TrackerState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { shows: [] };
    return JSON.parse(raw) as TrackerState;
  } catch {
    return { shows: [] };
  }
}

async function write(state: TrackerState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // noop
  }
}

export const StorageRepo = {
  async getState(): Promise<TrackerState> {
    return read();
  },
  async setState(next: TrackerState): Promise<void> {
    await write(next);
  },
  async setProfile(profile: UserProfile): Promise<void> {
    const s = await read();
    await write({ ...s, profile });
  },
  async setOmdbApiKey(key?: string): Promise<void> {
    const s = await read();
    await write({ ...s, omdbApiKey: key });
  },
  async addShow(show: Show): Promise<void> {
    const s = await read();
    const exists = (s.shows || []).some((x) => x.imdbId === show.imdbId);
    if (exists) return;
    const showWithDefaults = { ...show, hideWatched: true };
    await write({ ...s, shows: [showWithDefaults, ...(s.shows || [])] });
  },
  async removeShow(imdbId: string): Promise<void> {
    const s = await read();
    await write({
      ...s,
      shows: (s.shows || []).filter((x) => x.imdbId !== imdbId),
    });
  },
  async setNotification(day: number): Promise<void> {
    const s = await read();
    await write({ ...s, notificationDay: day });
  },
};
