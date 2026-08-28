import { IMDB_BASE_URL, normalizeShowTransfer } from '@movie-tracker/core'
import type { Show, TrackerState } from '@movie-tracker/core'

type ImportOptions = {
  includeEpisodes?: boolean
}

export const importShows = (
  currentState: TrackerState,
  importedShows: Array<Partial<Show>>,
  selectedIds: Record<string, boolean>,
  options: ImportOptions = {},
): TrackerState => {
  const { includeEpisodes = false } = options

  const toApply: Array<Show> = [...currentState.shows]
  const existingByTitle = new Map<string, Show>()

  // Build a map of existing shows by title for quick lookup
  currentState.shows.forEach((ex) => {
    const key = (ex.title || '').toLowerCase().trim()
    if (key) existingByTitle.set(key, ex)
  })

  // Process each imported show
  for (const s of importedShows) {
    if (!s.imdbId || !selectedIds[s.imdbId]) continue

    const titleKey = (s.title || '').toLowerCase().trim()
    const existing = titleKey ? existingByTitle.get(titleKey) : undefined

    // Skip existing items (no replace logic)
    if (existing) {
      continue
    }

    // Normalize and add the show
    const normalizedShow = normalizeShowTransfer(s, { includeEpisodes })
    toApply.push({
      ...normalizedShow,
      imdbId: s.imdbId,
      title: s.title || s.imdbId,
      imdbUrl: s.imdbUrl || `${IMDB_BASE_URL}/${s.imdbId}`,
    })
  }

  return { ...currentState, shows: toApply }
}
