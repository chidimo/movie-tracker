import { normalizeOmdbShow } from '@/lib/compute-omdb'
import {
  omdbGetSeason,
  omdbGetTitle,
  omdbSearch,
} from '@/lib/omdb'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

type OptionsType = Omit<
  Parameters<typeof useQuery>[0], // Get the type of the first parameter
  'queryKey' | 'queryFn'
>

export const useSearchSeries = (
  q: string | undefined,
  options?: OptionsType,
) => {
  const enabled = !!q && q.trim().length > 0 && (options?.enabled ?? true)

  return useQuery({
    queryKey: ['omdb', 'searchSeries', { q }],
    enabled,
    queryFn: () => omdbSearch(q!.trim()),
    ...options,
  } as any)
}

export const useGetTitle = (
  imdbID: string | undefined,
  options?: OptionsType,
) => {
  const enabled = !!imdbID && (options?.enabled ?? true)

  return useQuery({
    queryKey: ['omdb', 'getTitle', { imdbID }],
    enabled,
    queryFn: () => omdbGetTitle(imdbID!),
    ...options,
  } as any)
}

export const useFetchSeasons = (
  imdbID: string | undefined,
  season: string | number | undefined,
  options?: OptionsType,
) => {
  const seasonString = useMemo(
    () =>
      season === null || season === undefined ? undefined : String(season),
    [season],
  )
  const enabled = !!imdbID && !!seasonString && (options?.enabled ?? true)

  return useQuery({
    queryKey: ['omdb', 'fetchSeasons', { imdbID, season: seasonString }],
    enabled,
    queryFn: () => omdbGetSeason(imdbID!, Number(seasonString!)),
    ...options,
  } as any)
}

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
