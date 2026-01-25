import type { TrackerState, Show, UserProfile } from '../types/types'

const STORAGE_KEY = 'series-tracker'

function read(): TrackerState {
  if (typeof globalThis.window === 'undefined') return { shows: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { shows: [] }
    return JSON.parse(raw) as TrackerState
  } catch {
    return { shows: [] }
  }
}

function write(state: TrackerState) {
  if (typeof globalThis.window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const StorageRepo = {
  getState(): TrackerState {
    return read()
  },
  setState(next: TrackerState) {
    write(next)
  },
  setProfile(profile: UserProfile) {
    const s = read()
    write({ ...s, profile })
  },
  setOmdbApiKey(key?: string) {
    const s = read()
    write({ ...s, omdbApiKey: key })
  },
  addShow(show: Show) {
    const s = read()
    const exists = s.shows.some((x) => x.imdbId === show.imdbId)
    if (exists) return
    const showWithDefaults = { ...show, hideWatched: true }
    write({ ...s, shows: [showWithDefaults, ...(s.shows || [])] })
  },
  removeShow(imdbId: string) {
    const s = read()
    write({ ...s, shows: (s.shows || []).filter((x) => x.imdbId !== imdbId) })
  },
  setNotification(day: number) {
    const s = read()
    write({ ...s, notificationDay: day })
  },
}
