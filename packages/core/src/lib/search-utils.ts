import type { OmdbSearchItem } from '@movie-tracker/core'

/**
 * Filter out duplicate items from search results based on imdbID
 * @param items - Array of search items
 * @returns Array with unique imdbID values
 */
export const filterDuplicateItems = (
  items: Array<OmdbSearchItem>,
): Array<OmdbSearchItem> => {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.imdbID)) {
      return false
    }
    seen.add(item.imdbID)
    return true
  })
}

/**
 * Filter out items that are already in the user's library
 * @param items - Array of search items
 * @param userShows - User's existing shows with imdbId
 * @returns Array with items not in user's library
 */
export const filterExistingItems = (
  items: Array<OmdbSearchItem>,
  userShows: Array<{ imdbId: string }>,
): Array<OmdbSearchItem> => {
  const userImdbIds = new Set(userShows.map((show) => show.imdbId))
  return items.filter((item) => !userImdbIds.has(item.imdbID))
}

/**
 * Combined filter: remove duplicates and existing items
 * @param items - Array of search items
 * @param userShows - User's existing shows with imdbId
 * @returns Array with unique items not in user's library
 */
export const filterSearchResults = (
  items: Array<OmdbSearchItem>,
  userShows: Array<{ imdbId: string }>,
): Array<OmdbSearchItem> => {
  const deduplicated = filterDuplicateItems(items)
  return filterExistingItems(deduplicated, userShows)
}
