import { useMutation, useQuery } from "@tanstack/react-query"
import { 
  normalizeOmdbShow, 
  omdbGetSeason, 
  omdbGetTitle, 
  omdbSearch 
} from "@movie-tracker/core"
import type { UseQueryResult } from "@tanstack/react-query"
import type { 
  OmdbSearchItem, 
  OmdbSeasonResponse, 
  Show
} from "@movie-tracker/core"

// Export types for external use
export type SearchOptionsType = {
  enabled?: boolean
}

export type SeasonOptionsType = {
  enabled?: boolean  
}

export type ShowOptionsType = {
  enabled?: boolean
}

export const useSearchSeries = (
  query: string,
  options: SearchOptionsType = {},
) => {
  const enabled = !!query && (options.enabled ?? true)

  return useQuery<Array<OmdbSearchItem>>({
    queryKey: ["omdb", "search", { query }],
    enabled,
    queryFn: async () => {
      const result = await omdbSearch(query)
      return result
    },
    ...options,
  })
}

export const useFetchSeasons = (
  imdbID: string | undefined,
  seasonString: string | undefined,
  options: SeasonOptionsType = {},
) => {
  const enabled = !!imdbID && !!seasonString && (options.enabled ?? true)

  return useQuery<Array<OmdbSeasonResponse>>({
    queryKey: ["omdb", "seasons", { imdbID, seasonString }],
    enabled,
    queryFn: async () => {
      const result = await omdbGetSeason(imdbID!, Number(seasonString))
      if (!result) {
        throw new Error("Season not found")
      }
      return [result]
    },
    ...options,
  })
}

export const useGetShow = (
  imdbID: string | undefined,
  options: ShowOptionsType = {},
): UseQueryResult<Show> => {
  const enabled = !!imdbID && (options.enabled ?? true)

  return useQuery<Show>({
    queryKey: ["omdb", "getShow", { imdbID }],
    enabled,
    queryFn: async () => {
      const result = await omdbGetTitle(imdbID!)
      if (!result) {
        throw new Error("Show not found")
      }
      return normalizeOmdbShow(result)
    },
    ...options,
  })
}

// Get show title/details (alias for useGetShow for backward compatibility)
export const useGetTitle = (
  imdbID: string | undefined,
  options?: ShowOptionsType,
): UseQueryResult<Show> => {
  const enabled = !!imdbID && (options?.enabled ?? true)

  return useQuery<Show>({
    queryKey: ["omdb", "getTitle", { imdbID }],
    enabled,
    queryFn: async () => {
      const result = await omdbGetTitle(imdbID!)
      if (!result) {
        throw new Error("Show not found")
      }
      return normalizeOmdbShow(result)
    },
    ...options,
  })
}

// Mutation for fetching show title
export function useOmdbTitleMutation() {
  return useMutation({
    mutationFn: async (imdbID: string) => {
      const result = await omdbGetTitle(imdbID)
      if (!result) {
        throw new Error("Show not found")
      }
      return normalizeOmdbShow(result)
    },
  })
}
