export type OmdbSearchItem = {
  imdbID: string
  Title: string
  Year?: string
  Poster?: string
  Type?: string
}

export type OmdbSearchResponse = {
  Search?: OmdbSearchItem[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

export type OmdbTitleResponse = {
  imdbID: string
  Title: string
  Year?: string
  Poster?: string
  Plot?: string
  Runtime?: string // e.g. "60 min"
  totalSeasons?: string // for series
  Actors?: string // comma-separated
  Released?: string // date string
  Response: 'True' | 'False'
  Error?: string
}

export type OmdbSeasonEpisode = {
  Title: string
  Released?: string // date
  Episode?: string // number as string
  imdbID: string
}

export type OmdbSeasonResponse = {
  Title?: string
  Season?: string
  totalSeasons?: string
  Episodes?: OmdbSeasonEpisode[]
  Response: 'True' | 'False'
  Error?: string
}

const omdbFunctionPath = '/.netlify/functions/omdb'

function buildOmdbFunctionUrl(params: Record<string, string>): string {
  const url = new URL(omdbFunctionPath, 'http://localhost')
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  return `${url.pathname}${url.search}`
}

export async function omdbSearch(q: string): Promise<OmdbSearchItem[]> {
  if (!q.trim()) return []
  const url = buildOmdbFunctionUrl({ type: 'series', s: q })
  const res = await fetch(url)
  const data = (await res.json()) as OmdbSearchResponse
  if (data.Response === 'True') return (data.Search || []).slice(0, 5)
  return []
}

export async function omdbGetTitle(
  imdbID: string,
): Promise<OmdbTitleResponse | null> {
  const url = buildOmdbFunctionUrl({ i: imdbID, plot: 'short' })
  const res = await fetch(url)
  const data = (await res.json()) as OmdbTitleResponse
  if (data.Response === 'True') return data
  return null
}

export async function omdbGetSeason(
  imdbID: string,
  season: number,
): Promise<OmdbSeasonResponse | null> {
  const url = buildOmdbFunctionUrl({ i: imdbID, season: String(season) })
  const res = await fetch(url)
  const data = (await res.json()) as OmdbSeasonResponse
  if (data.Response === 'True') return data
  return null
}
