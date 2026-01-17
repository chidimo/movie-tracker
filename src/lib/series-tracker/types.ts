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
  mainCast?: string[]
  plot?: string
  totalSeasons?: number
  nextAirDate?: string // ISO string for next upcoming episode release if known
  seasons: Season[]
  rating?: number
  genres?: string[]
  releaseDate?: string;
  votes?: number;
  awards?: string;
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
  episodes: Episode[]
}

export type TrackerState = {
  profile?: UserProfile
  shows: Show[]
  omdbApiKey?: string
}
