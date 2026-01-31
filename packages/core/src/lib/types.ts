export type UserProfile = {
  slug: string // slugified name
  name: string
  registeredAt: string
  email?: string
}

export type Show = {
  imdbId: string // e.g., tt0944947
  title: string
  thumbnail?: string // poster URL
  imdbUrl: string // https://www.imdb.com/title/<imdbId>
  releaseYear?: string
  mainCast?: Array<string>
  plot?: string
  totalSeasons?: number
  nextAirDate?: string // ISO string for next upcoming episode release if known
  seasons: Array<Season>
  rating?: number
  genres?: Array<string>
  releaseDate?: string
  votes?: number
  awards?: string
  // Additional OMDB fields
  rated?: string // TV rating/Content rating (e.g., "TV-MA")
  runtime?: string // Runtime (e.g., "60 min")
  director?: string // Director information
  writer?: string // Writer information
  language?: string // Language(s)
  country?: string // Country of origin
  metascore?: string // Metacritic score
  ratings?: Array<{
    // Ratings from different sources
    Source: string
    Value: string
  }>
  // computed fields
  hideWatched?: boolean // whether to hide watched episodes by default
  // Tentative scheduling (user-entered)
  tentativeNextAirDate?: string // ISO date for the selected 'next air' baseline
  tentativeNextEpisode?: { seasonNumber: number; episodeNumber: number }
  tentativeFrequencyDays?: number // default 7
}

export type Episode = {
  title: string
  releaseDate?: string
  summary?: string
  runtimeMinutes?: number
  episodeNumber?: number
  watched?: boolean
  rating?: string
  imdbUrl?: string
  imdbId?: string
}

export type Season = {
  title: string
  seasonNumber?: number
  releaseDate?: string
  summary?: string
  episodes: Array<Episode>
}

export type TrackerState = {
  profile?: UserProfile
  shows: Array<Show>
  showOrder?: Array<string> // array of imdbIds in custom order
  omdbApiKey?: string
  notificationDay?: number
}
