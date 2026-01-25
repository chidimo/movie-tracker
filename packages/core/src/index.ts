// Export all shared types
export type { 
  BaseProgressProps,
  SeriesProgressProps, 
  SeasonProgressProps, 
  ProgressProps,
  ProgressResult 
} from './hooks/use-progress'

// Export all shared hooks
export { useProgress } from './hooks/use-progress'

// Export movie hooks
export { 
  useSearchSeries, 
  useFetchSeasons, 
  useOmdbTitleMutation, 
  useGetShow 
} from './hooks/use-movies'

// Export OMDB types and functions
export { 
  omdbSearch, 
  omdbGetTitle, 
  omdbGetSeason 
} from './lib/omdb'

export { 
  normalizeOmdbShow,
  normalizeShowTransfer 
} from './lib/compute-omdb'

export type { 
  OmdbSearchItem,
  OmdbSearchResponse,
  OmdbTitleResponse,
  OmdbSeasonEpisode,
  OmdbSeasonResponse 
} from './lib/omdb'

// Export utilities
export { 
  cleanStringifiedNumber,
  formatNumber,
  isWithinDays,
  getPaddedNumber,
  formatTentative,
  parseDayMonthYearToISO 
} from './lib/utils'

// Export constants
export { DEFAULT_DAYS_SOON, IMDB_BASE_URL } from './lib/constants'

// Export types
export type { 
  UserProfile, 
  Show, 
  Episode, 
  Season, 
  TrackerState 
} from './types/types'

// Export context
export { useSeriesTracker } from './context/series-tracker-context'
