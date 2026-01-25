import { normalizeOmdbShow } from "../lib/compute-omdb";
import {
  omdbGetSeason,
  omdbGetTitle,
  omdbSearch,
  type OmdbSearchItem,
  type OmdbSeasonResponse,
} from "../lib/omdb";
import type { Show } from "../types/types";
import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

type SearchOptionsType = Omit<
  Parameters<typeof useQuery<OmdbSearchItem[]>>[0],
  "queryKey" | "queryFn"
>;

type SeasonOptionsType = Omit<
  Parameters<typeof useQuery<OmdbSeasonResponse[]>>[0],
  "queryKey" | "queryFn"
>;

export const useSearchSeries = (
  q: string | undefined,
  options?: SearchOptionsType,
): UseQueryResult<OmdbSearchItem[]> => {
  const enabled = !!q && q.trim().length > 0 && (options?.enabled ?? true);

  return useQuery<OmdbSearchItem[]>({
    queryKey: ["omdb", "searchSeries", { q }],
    enabled,
    queryFn: () => omdbSearch(q!.trim()),
    ...options,
  });
};

export const useFetchSeasons = (
  imdbID: string | undefined,
  season: string | number | undefined,
  options?: SeasonOptionsType,
): UseQueryResult<OmdbSeasonResponse[]> => {
  const seasonString = useMemo(
    () =>
      season === null || season === undefined ? undefined : String(season),
    [season],
  );
  const enabled = !!imdbID && !!seasonString && (options?.enabled ?? true);

  return useQuery<OmdbSeasonResponse[]>({
    queryKey: ["omdb", "fetchSeasons", { imdbID, season: seasonString }],
    enabled,
    queryFn: async () => {
      const result = await omdbGetSeason(imdbID!, Number(seasonString!));
      if (!result) {
        throw new Error("Season not found");
      }
      return [result];
    },
    ...options,
  });
};

export function useOmdbTitleMutation() {
  return useMutation({
    mutationFn: async (imdbID: string) => {
      const result = await omdbGetTitle(imdbID);
      if (!result) {
        throw new Error("Show not found");
      }
      return normalizeOmdbShow(result);
    },
  });
}

type ShowOptionsType = Omit<
  Parameters<typeof useQuery<Show>>[0],
  "queryKey" | "queryFn"
>;

export const useGetShow = (
  imdbID: string | undefined,
  options?: ShowOptionsType,
): UseQueryResult<Show> => {
  const enabled = !!imdbID && (options?.enabled ?? true);

  return useQuery<Show>({
    queryKey: ["omdb", "getShow", { imdbID }],
    enabled,
    queryFn: async () => {
      const result = await omdbGetTitle(imdbID!);
      if (!result) {
        throw new Error("Show not found");
      }
      return normalizeOmdbShow(result);
    },
    ...options,
  });
};
