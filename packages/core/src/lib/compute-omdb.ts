import type { OmdbTitleResponse, Show } from '@movie-tracker/core'

// Utility functions needed for compute-omdb
export const cleanStringifiedNumber = (s?: string) => {
  if (!s) return undefined
  return Number(s.replaceAll(',', ''))
}

export const parseDayMonthYearToISO = (dateStr: string) => {
  if (!dateStr || typeof dateStr !== 'string') {
    return undefined
  }

  // Handle various date formats from OMDB
  const cleanDateStr = dateStr.trim()
  
  // Try to parse common formats
  const date = new Date(cleanDateStr)
  
  // Check if date is valid
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

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
