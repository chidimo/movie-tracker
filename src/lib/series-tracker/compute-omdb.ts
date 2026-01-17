import { cleanStringifiedNumber } from '../utils'
import type { OmdbTitleResponse } from './omdb'
import type { Show } from './types'

export const computeOmdbShow = (full: OmdbTitleResponse) => {
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
      ? new Date(full.Released).toISOString()
      : undefined,
    awards: full?.Awards,
  }

  return show
}
