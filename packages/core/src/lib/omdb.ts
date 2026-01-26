type OmdbResponse = 'True' | 'False'

export type OmdbSearchItem = {
  imdbID: string
  Title: string
  Year?: string
  Poster?: string
  Type?: string
}

export type OmdbSearchResponse = {
  Search?: Array<OmdbSearchItem>
  totalResults?: string
  Response: OmdbResponse
  Error?: string
}

export type OmdbTitleResponse = {
  Title: string
  imdbID: string
  Year?: string
  Poster?: string
  Plot?: string
  Rated?: string
  Runtime?: string // e.g. "60 min"
  Type: 'series'
  totalSeasons?: string // for series
  Actors?: string // comma-separated
  Released?: string // date string
  Response: OmdbResponse
  Error?: string
  Genre: string
  Director: string
  Writer: string
  Language: string
  Country: string
  Awards: string
  Ratings: Array<{
    Source: string
    Value: string
  }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
}

export type OmdbSeasonEpisode = {
  Title: string
  Released?: string // date
  Episode?: string // number as string
  imdbID: string
  imdbRating: string
}

export type OmdbSeasonResponse = {
  Title?: string
  Season?: string
  totalSeasons?: string
  Episodes?: Array<OmdbSeasonEpisode>
  Response: OmdbResponse
  Error?: string
}

// Web implementation using Netlify functions
export function createWebOmdbFunctions(options: { omdbFunctionPath: string }) {
  const { omdbFunctionPath } = options

  function buildOmdbFunctionUrl(params: Record<string, string>): string {
    const url = new URL(omdbFunctionPath, 'http://localhost')
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
    return `${url.pathname}${url.search}`
  }

  return {
    async omdbSearch(q: string): Promise<Array<OmdbSearchItem>> {
      if (!q.trim()) return []
      const url = buildOmdbFunctionUrl({ type: 'series', s: q })
      const res = await fetch(url)
      const data = (await res.json()) as OmdbSearchResponse
      if (data.Response === 'True') return (data.Search || []).slice(0, 5)
      return []
    },

    async omdbGetTitle(
      imdbID: string,
    ): Promise<OmdbTitleResponse | null> {
      const url = buildOmdbFunctionUrl({ i: imdbID, plot: 'short' })
      const res = await fetch(url)
      const data = (await res.json()) as OmdbTitleResponse
      if (data.Response === 'True') return data
      return null
    },

    async omdbGetSeason(
      imdbID: string,
      season: number,
    ): Promise<OmdbSeasonResponse | null> {
      const url = buildOmdbFunctionUrl({ i: imdbID, season: String(season) })
      const res = await fetch(url)
      const data = (await res.json()) as OmdbSeasonResponse
      if (data.Response === 'True') return data
      return null
    }
  }
}

// Mobile implementation using direct OMDB API
export function createMobileOmdbFunctions(apiKey?: string) {
  function buildOmdbUrl(params: Record<string, string>): URL {
    if (!apiKey) return new URL("")
    const url = new URL("https://www.omdbapi.com/")
    url.searchParams.set("apikey", apiKey)
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
    return url
  }

  return {
    async omdbSearch(q: string): Promise<Array<OmdbSearchItem>> {
      if (!apiKey || !q.trim()) return []
      const url = buildOmdbUrl({ type: "series", s: q })
      const res = await fetch(url.toString())
      const data = (await res.json()) as OmdbSearchResponse
      if (data.Response === "True") return (data.Search || []).slice(0, 5)
      return []
    },

    async omdbGetTitle(
      imdbID: string
    ): Promise<OmdbTitleResponse | null> {
      if (!apiKey) return null
      const url = buildOmdbUrl({ i: imdbID, plot: "short" })
      const res = await fetch(url.toString())
      const data = (await res.json()) as OmdbTitleResponse
      if (data.Response === "True") return data
      return null
    },

    async omdbGetSeason(
      imdbID: string,
      season: number
    ): Promise<OmdbSeasonResponse | null> {
      if (!apiKey) return null
      const url = buildOmdbUrl({ i: imdbID, Season: String(season) })
      const res = await fetch(url.toString())
      const data = (await res.json()) as OmdbSeasonResponse
      if (data.Response === "True") return data
      return null
    }
  }
}
