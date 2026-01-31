import { useMutation, useQuery } from '@tanstack/react-query'
import {
  normalizeOmdbShow,
  omdbGetSeason,
  omdbGetTitle,
  omdbSearch,
} from '@movie-tracker/core'
import type { UseQueryResult } from '@tanstack/react-query'
import type {
  OmdbSearchItem,
  OmdbSearchResponse,
  OmdbSeasonResponse,
  Show,
} from '@movie-tracker/core'

// Export types for external use
export type SearchOptionsType = Omit<
  Parameters<typeof useQuery<OmdbSearchItem[]>>[0],
  'queryKey' | 'queryFn'
>

export type SeasonOptionsType = Omit<
  Parameters<typeof useQuery<OmdbSeasonResponse[]>>[0],
  'queryKey' | 'queryFn'
>

export type ShowOptionsType = Omit<
  Parameters<typeof useQuery<Show>>[0],
  'queryKey' | 'queryFn'
>

export const useSearchSeries = (
  query: string,
  options: SearchOptionsType = {},
) => {
  const enabled = !!query && (options.enabled ?? true)

  return useQuery<OmdbSearchItem[]>({
    queryKey: ['omdb', 'search', { query }],
    enabled,
    queryFn: async () => {
      const result = (await omdbSearch(query)) as unknown as OmdbSearchResponse
      return result?.Search || []
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

  return useQuery<OmdbSeasonResponse[]>({
    queryKey: ['omdb', 'seasons', { imdbID, seasonString }],
    enabled,
    queryFn: async () => {
      const result = await omdbGetSeason(imdbID!, Number(seasonString))
      if (!result) {
        throw new Error('Season not found')
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
    queryKey: ['omdb', 'getShow', { imdbID }],
    enabled,
    queryFn: async () => {
      const result = await omdbGetTitle(imdbID!)
      if (!result) {
        throw new Error('Show not found')
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
        throw new Error('Show not found')
      }
      return normalizeOmdbShow(result)
    },
  })
}
