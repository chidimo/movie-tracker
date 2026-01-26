import { cleanStringifiedNumber, parseDayMonthYearToISO } from './utils'
import type { OmdbTitleResponse } from './omdb'
import type { Show } from '@movie-tracker/core'

export const normalizeOmdbShow = (full: OmdbTitleResponse) => {
  const show: Show = {
    imdbId: full.imdbID,
    title: full?.Title ?? full.Title,
    thumbnail: full?.Poster ?? full.Poster,
    imdbUrl: `https://www.imdb.com/title/${full.imdbID}`,
    releaseYear: full?.Year ?? full.Year,
    mainCast: full?.Actors?.split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    plot: full?.Plot,
    seasons: [],
    totalSeasons: cleanStringifiedNumber(full.totalSeasons),
    rating: cleanStringifiedNumber(full.imdbRating),
    votes: cleanStringifiedNumber(full.imdbVotes),
    genres: full?.Genre?.split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    releaseDate: full?.Released
      ? parseDayMonthYearToISO(full.Released)
      : undefined,
    awards: full?.Awards,
    rated: full?.Rated,
    runtime: full?.Runtime,
    director: full?.Director,
    writer: full?.Writer,
    language: full?.Language,
    country: full?.Country,
    metascore: full?.Metascore,
    ratings: full?.Ratings,
  }

  return show
}

type NormalizeOptions = {
  includeEpisodes?: boolean
}

export const normalizeShowTransfer = (
  show: Partial<Show>,
  options: NormalizeOptions = {},
) => {
  const includeEpisodes = options.includeEpisodes ?? false

  return {
    ...show,
    seasons: includeEpisodes ? (show.seasons ?? []) : [],
  }
}
