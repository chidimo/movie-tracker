import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { StorageRepo } from './storage'
import { scheduleTentativeNotifications } from './notifications'
import type { TrackerState, Show, UserProfile, Season } from '../types/types'

export type SeriesTrackerContextValue = {
  state: TrackerState
  setState: React.Dispatch<React.SetStateAction<TrackerState>>
  refresh: () => void
  setProfile: (profile: UserProfile) => void
  setOmdbApiKey: (key?: string) => void
  addShow: (show: Show) => void
  removeShow: (imdbId: string) => void
  updateShow: (show: Show) => void
  replaceState: (next: TrackerState) => void
  getShowById: (imdbId: string) => Show | undefined
  getShowProgress: (imdbId: string) => { watched: number; total: number }
  setNotification: (day: number) => void
  reorderShows: (fromIndex: number, toIndex: number) => void
  moveShowToTop: (imdbId: string) => void
  getOrderedShows: () => Show[]
}

const SeriesTrackerContext = createContext<
  SeriesTrackerContextValue | undefined
>(undefined)

export function SeriesTrackerProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [state, setState] = useState<TrackerState>({ shows: [] })

  const rescheduleNotifications = useCallback(
    async (nextState: TrackerState) => {
      const leadDays = nextState.notificationDay ?? 2
      await scheduleTentativeNotifications(nextState, leadDays)
    },
    [],
  )

  // Initial load
  useEffect(() => {
    setState(StorageRepo.getState())
  }, [])

  // Sync across tabs and when localStorage changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      // If any change occurs in localStorage, refresh from repo
      // This keeps state in sync across tabs and with imperative updates.
      if (typeof e.key === 'string') {
        setState(StorageRepo.getState())
      }
    }
    globalThis.addEventListener?.('storage', onStorage as any)
    return () => globalThis.removeEventListener?.('storage', onStorage as any)
  }, [])

  const refresh = useCallback(() => {
    setState(StorageRepo.getState())
  }, [])

  const setProfile = useCallback((profile: UserProfile) => {
    StorageRepo.setProfile(profile)
    setState(StorageRepo.getState())
  }, [])

  const setOmdbApiKey = useCallback((key?: string) => {
    StorageRepo.setOmdbApiKey(key)
    setState(StorageRepo.getState())
  }, [])

  const addShow = useCallback((show: Show) => {
    const current = StorageRepo.getState()
    const updated: TrackerState = {
      ...current,
      shows: [...current.shows, show],
      showOrder: [...(current.showOrder || []), show.imdbId],
    }
    StorageRepo.setState(updated)
    setState(updated)
  }, [])

  const removeShow = useCallback((imdbId: string) => {
    const current = StorageRepo.getState()
    const updated: TrackerState = {
      ...current,
      shows: current.shows.filter((s) => s.imdbId !== imdbId),
      showOrder: current.showOrder?.filter((id) => id !== imdbId),
    }
    StorageRepo.setState(updated)
    setState(updated)
  }, [])

  const updateShow = useCallback((show: Show) => {
    const current = StorageRepo.getState()
    const updated: TrackerState = {
      ...current,
      shows: current.shows.map((s) => (s.imdbId === show.imdbId ? show : s)),
    }
    StorageRepo.setState(updated)
    setState(updated)
  }, [])

  const replaceState = useCallback((next: TrackerState) => {
    StorageRepo.setState(next)
    setState(StorageRepo.getState())
  }, [])

  const getShowById = useCallback(
    (imdbId: string) => {
      return state.shows.find((s) => s.imdbId === imdbId)
    },
    [state],
  )

  const getShowProgress = useCallback(
    (imdbId: string) => {
      const show = getShowById(imdbId)
      const allEpisodes = (show?.seasons || []).flatMap(
        (s: Season) => s.episodes || [],
      )
      const total = allEpisodes.length
      const watched = allEpisodes.filter((e) => e.watched).length
      return { watched, total }
    },
    [getShowById],
  )

  const setNotification = useCallback(
    (day: number) => {
      StorageRepo.setNotification(day)
      const next = StorageRepo.getState()
      setState(next)
      rescheduleNotifications(next)
    },
    [rescheduleNotifications],
  )

  const reorderShows = useCallback((fromIndex: number, toIndex: number) => {
    const current = StorageRepo.getState()
    const order = current.showOrder || current.shows.map((s) => s.imdbId)
    const newOrder = [...order]
    const [movedItem] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, movedItem)

    const updated: TrackerState = {
      ...current,
      showOrder: newOrder,
    }
    StorageRepo.setState(updated)
    setState(updated)
  }, [])

  const moveShowToTop = useCallback((imdbId: string) => {
    const current = StorageRepo.getState()
    const order = current.showOrder || current.shows.map((s) => s.imdbId)
    const currentIndex = order.indexOf(imdbId)
    if (currentIndex > 0) {
      const newOrder = [imdbId, ...order.filter((id) => id !== imdbId)]
      const updated: TrackerState = {
        ...current,
        showOrder: newOrder,
      }
      StorageRepo.setState(updated)
      setState(updated)
    }
  }, [])

  const getOrderedShows = useCallback(() => {
    const order = state.showOrder || state.shows.map((s) => s.imdbId)
    const showMap = new Map(state.shows.map((s) => [s.imdbId, s]))
    return order
      .map((id) => showMap.get(id))
      .filter((s): s is Show => s !== undefined)
  }, [state])

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
  )

  return (
    <SeriesTrackerContext.Provider value={value}>
      {children}
    </SeriesTrackerContext.Provider>
  )
}

export function useSeriesTracker() {
  const ctx = useContext(SeriesTrackerContext)
  if (!ctx)
    throw new Error(
      'useSeriesTracker must be used within a SeriesTrackerProvider',
    )
  return ctx
}
