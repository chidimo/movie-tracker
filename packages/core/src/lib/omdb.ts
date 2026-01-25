type OmdbResponse = "True" | "False";

export type OmdbSearchItem = {
  imdbID: string;
  Title: string;
  Year?: string;
  Poster?: string;
  Type?: string;
};

export type OmdbSearchResponse = {
  Search?: OmdbSearchItem[];
  totalResults?: string;
  Response: OmdbResponse;
  Error?: string;
};

export type OmdbTitleResponse = {
  Title: string;
  imdbID: string;
  Year?: string;
  Poster?: string;
  Plot?: string;
  Rated?: string;
  Runtime?: string; // e.g. "60 min"
  Type: "series";
  totalSeasons?: string; // for series
  Actors?: string; // comma-separated
  Released?: string; // date string
  Response: OmdbResponse;
  Error?: string;
  Genre: string;
  Director: string;
  Writer: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: [
    {
      Source: string;
      Value: string;
    }
  ];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
};

export type OmdbSeasonEpisode = {
  Title: string;
  Released?: string; // date
  Episode?: string; // number as string
  imdbID: string;
  imdbRating: string;
};

export type OmdbSeasonResponse = {
  Title?: string;
  Season?: string;
  totalSeasons?: string;
  Episodes?: OmdbSeasonEpisode[];
  Response: OmdbResponse;
  Error?: string;
};

const apiKey = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_OMDB_API_KEY) || 
                (typeof process !== 'undefined' && process.env?.VITE_OMDB_API_KEY) || 
                (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.EXPO_PUBLIC_OMDB_API_KEY) ||
                (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.VITE_OMDB_API_KEY);

function buildOmdbUrl(params: Record<string, string>): URL {
  if (!apiKey) return new URL("");
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url;
}

export async function omdbSearch(q: string): Promise<OmdbSearchItem[]> {
  if (!apiKey || !q.trim()) return [];
  const url = buildOmdbUrl({ type: "series", s: q });
  const res = await fetch(url.toString());
  const data = (await res.json()) as OmdbSearchResponse;
  if (data.Response === "True") return (data.Search || []).slice(0, 5);
  return [];
}

export async function omdbGetTitle(
  imdbID: string
): Promise<OmdbTitleResponse | null> {
  if (!apiKey) return null;
  const url = buildOmdbUrl({ i: imdbID, plot: "short" });
  const res = await fetch(url.toString());
  const data = (await res.json()) as OmdbTitleResponse;
  if (data.Response === "True") return data;
  return null;
}

export async function omdbGetSeason(
  imdbID: string,
  season: number
): Promise<OmdbSeasonResponse | null> {
  if (!apiKey) return null;
  const url = buildOmdbUrl({ i: imdbID, Season: String(season) });
  const res = await fetch(url.toString());
  const data = (await res.json()) as OmdbSeasonResponse;
  if (data.Response === "True") return data;
  return null;
}
