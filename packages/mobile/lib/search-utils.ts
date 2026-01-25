// Utility to filter duplicate items from search results
import { OmdbSearchItem } from "@/components/series-tracker/search-result";

/**
 * Filter out duplicate items from search results based on imdbID
 * @param items - Array of search items
 * @returns Array with unique imdbID values
 */
export const filterDuplicateItems = (
  items: OmdbSearchItem[],
): OmdbSearchItem[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.imdbID)) {
      return false;
    }
    seen.add(item.imdbID);
    return true;
  });
};

/**
 * Filter out items that are already in the user's library
 * @param items - Array of search items
 * @param userShows - User's existing shows with imdbId
 * @returns Array with items not in user's library
 */
export const filterExistingItems = (
  items: OmdbSearchItem[],
  userShows: { imdbId: string }[],
): OmdbSearchItem[] => {
  const userImdbIds = new Set(userShows.map((show) => show.imdbId));
  return items.filter((item) => !userImdbIds.has(item.imdbID));
};

/**
 * Combined filter: remove duplicates and existing items
 * @param items - Array of search items
 * @param userShows - User's existing shows with imdbId
 * @returns Array with unique items not in user's library
 */
export const filterSearchResults = (
  items: OmdbSearchItem[],
  userShows: { imdbId: string }[],
): OmdbSearchItem[] => {
  const deduplicated = filterDuplicateItems(items);
  return filterExistingItems(deduplicated, userShows);
};
