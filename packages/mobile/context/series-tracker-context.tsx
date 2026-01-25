import { scheduleTentativeNotifications } from "@/lib/notifications";
import { StorageRepo } from "@/lib/storage";
import type { Season, Show, TrackerState, UserProfile } from "@/lib/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SeriesTrackerContextValue = {
  state: TrackerState;
  hasProfile: boolean;
  hasShows: boolean;
  profile: UserProfile | undefined;
  setState: React.Dispatch<React.SetStateAction<TrackerState>>;
  refresh: () => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  setOmdbApiKey: (key?: string) => Promise<void>;
  addShow: (show: Show) => Promise<void>;
  removeShow: (imdbId: string) => Promise<void>;
  updateShow: (show: Show) => Promise<void>;
  replaceState: (next: TrackerState) => Promise<void>;
  getShowById: (imdbId: string) => Show | undefined;
  getShowProgress: (imdbId: string) => { watched: number; total: number };
  setNotification: (day: number) => Promise<void>;
  reorderShows: (fromIndex: number, toIndex: number) => Promise<void>;
  moveShowToTop: (imdbId: string) => Promise<void>;
  getOrderedShows: () => Show[];
};

const SeriesTrackerContext = createContext<
  SeriesTrackerContextValue | undefined
>(undefined);

export const SeriesTrackerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState<TrackerState>({ shows: [] });

  const rescheduleNotifications = useCallback(
    async (nextState: TrackerState) => {
      const leadDays = nextState.notificationDay ?? 2;
      await scheduleTentativeNotifications(nextState, leadDays);
    },
    [],
  );

  // Initial load
  useEffect(() => {
    (async () => {
      const s = await StorageRepo.getState();
      setState(s);
      await rescheduleNotifications(s);
    })();
  }, [rescheduleNotifications]);

  // Note: No cross-tab storage events in React Native; state sync occurs after each write via refresh.

  const refresh = useCallback(async () => {
    const s = await StorageRepo.getState();
    setState(s);
  }, []);

  const setProfile = useCallback(
    async (profile: UserProfile) => {
      await StorageRepo.setProfile(profile);
      await refresh();
    },
    [refresh],
  );

  const setOmdbApiKey = useCallback(
    async (key?: string) => {
      await StorageRepo.setOmdbApiKey(key);
      await refresh();
    },
    [refresh],
  );

  const addShow = useCallback(
    async (show: Show) => {
      await StorageRepo.addShow(show);
      const next = await StorageRepo.getState();
      // Add show to showOrder if it doesn't exist
      if (!next.showOrder?.includes(show.imdbId)) {
        const updated: TrackerState = {
          ...next,
          showOrder: [...(next.showOrder || []), show.imdbId],
        };
        await StorageRepo.setState(updated);
        setState(updated);
      } else {
        setState(next);
      }
      await rescheduleNotifications(next);
    },
    [rescheduleNotifications],
  );

  const removeShow = useCallback(
    async (imdbId: string) => {
      await StorageRepo.removeShow(imdbId);
      const next = await StorageRepo.getState();
      // Remove show from showOrder if it exists
      const updated: TrackerState = {
        ...next,
        showOrder: next.showOrder?.filter((id) => id !== imdbId),
      };
      await StorageRepo.setState(updated);
      setState(updated);
      await rescheduleNotifications(updated);
    },
    [rescheduleNotifications],
  );

  const updateShow = useCallback(
    async (show: Show) => {
      const current = await StorageRepo.getState();
      const updated: TrackerState = {
        ...current,
        shows: current.shows.map((s) => (s.imdbId === show.imdbId ? show : s)),
      };
      await StorageRepo.setState(updated);
      setState(updated);
      await rescheduleNotifications(updated);
    },
    [rescheduleNotifications],
  );

  const replaceState = useCallback(
    async (next: TrackerState) => {
      await StorageRepo.setState(next);
      setState(next);
      await rescheduleNotifications(next);
    },
    [rescheduleNotifications],
  );

  const getShowById = useCallback(
    (imdbId: string) => {
      return state.shows.find((s) => s.imdbId === imdbId);
    },
    [state],
  );

  const getShowProgress = useCallback(
    (imdbId: string) => {
      const show = getShowById(imdbId);
      const allEpisodes = (show?.seasons || []).flatMap(
        (s: Season) => s.episodes || [],
      );
      const total = allEpisodes.length;
      const watched = allEpisodes.filter((e) => e.watched).length;
      return { watched, total };
    },
    [getShowById],
  );

  const setNotification = useCallback(
    async (day: number) => {
      await StorageRepo.setNotification(day);
      const next = await StorageRepo.getState();
      setState(next);
      await rescheduleNotifications(next);
    },
    [rescheduleNotifications],
  );

  const reorderShows = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const current = await StorageRepo.getState();
      const order = current.showOrder || current.shows.map((s) => s.imdbId);
      const newOrder = [...order];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);

      const updated: TrackerState = {
        ...current,
        showOrder: newOrder,
      };
      await StorageRepo.setState(updated);
      setState(updated);
      await rescheduleNotifications(updated);
    },
    [rescheduleNotifications],
  );

  const moveShowToTop = useCallback(
    async (imdbId: string) => {
      const current = await StorageRepo.getState();
      const order = current.showOrder || current.shows.map((s) => s.imdbId);
      const currentIndex = order.indexOf(imdbId);
      if (currentIndex > 0) {
        const newOrder = [imdbId, ...order.filter((id) => id !== imdbId)];
        const updated: TrackerState = {
          ...current,
          showOrder: newOrder,
        };
        await StorageRepo.setState(updated);
        setState(updated);
        await rescheduleNotifications(updated);
      }
    },
    [rescheduleNotifications],
  );

  const getOrderedShows = useCallback(() => {
    const order = state.showOrder || state.shows.map((s) => s.imdbId);
    const showMap = new Map(state.shows.map((s) => [s.imdbId, s]));
    return order
      .map((id) => showMap.get(id))
      .filter((s): s is Show => s !== undefined);
  }, [state]);

  const value = useMemo<SeriesTrackerContextValue>(
    () => ({
      state,
      setState,
      refresh,
      setProfile,
      setOmdbApiKey,
      addShow,
      removeShow,
      updateShow,
      replaceState,
      getShowById,
      getShowProgress,
      setNotification,
      reorderShows,
      moveShowToTop,
      getOrderedShows,
      hasProfile: !!state.profile?.name,
      hasShows: (state.shows?.length ?? 0) > 0,
      profile: state.profile,
    }),
    [
      state,
      refresh,
      setProfile,
      setOmdbApiKey,
      addShow,
      removeShow,
      updateShow,
      replaceState,
      getShowById,
      getShowProgress,
      setNotification,
      reorderShows,
      moveShowToTop,
      getOrderedShows,
    ],
  );

  return (
    <SeriesTrackerContext.Provider value={value}>
      {children}
    </SeriesTrackerContext.Provider>
  );
};

export function useSeriesTracker() {
  const ctx = useContext(SeriesTrackerContext);
  if (!ctx)
    throw new Error(
      "useSeriesTracker must be used within a SeriesTrackerProvider",
    );
  return ctx;
}
