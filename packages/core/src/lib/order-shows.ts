import type { TrackerState } from './types'

/**
 * Derive the display order of shows defensively.
 *
 * `showOrder` is a list of imdbIds describing the user's custom ordering, but
 * nothing guarantees it stays in sync with `shows` (imports, migrations and
 * legacy data can all leave it partial, stale or empty). This helper treats
 * `showOrder` as a hint only:
 *   - ids in `showOrder` that no longer exist in `shows` are ignored
 *   - duplicate ids are collapsed
 *   - shows missing from `showOrder` are appended, so a show can never
 *     disappear from the UI just because it isn't listed in `showOrder`
 */
export function orderShows<T extends { imdbId: string }>(
  shows: Array<T>,
  showOrder?: Array<string>,
): Array<T> {
  if (!showOrder?.length) return shows

  const byId = new Map(shows.map((s) => [s.imdbId, s]))
  const seen = new Set<string>()
  const ordered: Array<T> = []

  for (const id of showOrder) {
    const show = byId.get(id)
    if (show && !seen.has(id)) {
      ordered.push(show)
      seen.add(id)
    }
  }

  for (const show of shows) {
    if (!seen.has(show.imdbId)) ordered.push(show)
  }

  return ordered
}

/**
 * Coerce whatever was read from persistent storage into a valid TrackerState.
 * Older builds (and hand-edited data) sometimes stored a bare `Show[]` array or
 * an object without a `shows` field; both render as an empty library otherwise.
 */
export function normalizeTrackerState(value: unknown): TrackerState {
  if (Array.isArray(value)) {
    return { shows: value }
  }

  if (value && typeof value === 'object') {
    const state = value as Partial<TrackerState>
    return {
      ...state,
      shows: Array.isArray(state.shows) ? state.shows : [],
    }
  }

  return { shows: [] }
}
