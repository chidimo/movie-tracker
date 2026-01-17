import { useCallback, useState } from 'react'
import type { Episode, Season } from '@/lib/series-tracker/types'
import { omdbGetSeason, omdbGetTitle } from '@/lib/series-tracker/omdb'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { computeOmdbShow } from '@/lib/series-tracker/compute-omdb'

const getSingleSeason = async (
  id: string,
  showTitle: string,
  seasons: Season[],
  i: number,
) => {
  const data = await omdbGetSeason(id, i)
  if (!data || data.Response === 'False') return null

  const existing = seasons.find((s) => s.seasonNumber === i)

  const existingWatched = new Map<number, boolean>()
  existing?.episodes.forEach((e) => {
    if (typeof e.episodeNumber === 'number')
      existingWatched.set(e.episodeNumber, !!e.watched)
  })

  const eps: Episode[] = (data.Episodes || []).map((ep) => {
    const epNo = ep.Episode ? Number(ep.Episode) : undefined
    const released = ep.Released

    return {
      title: ep.Title,
      releaseDate:
        released && released !== 'N/A'
          ? new Date(released).toISOString()
          : undefined,
      episodeNumber: epNo,
      watched: epNo ? (existingWatched.get(epNo) ?? false) : false,
      rating: ep.imdbRating,
      imdbId: ep.imdbID,
      imdbUrl: ep.imdbID
        ? `https://www.imdb.com/title/${ep.imdbID}`
        : undefined,
    }
  })

  const computedSeason = {
    title: `${data.Title ?? showTitle} - Season ${data.Season ?? i}`,
    seasonNumber: data.Season ? Number(data.Season) : i,
    episodes: eps,
  }

  return computedSeason
}

export const FetchSeasons = ({ id }: { id: string }) => {
  const { updateShow, getShowById } = useSeriesTracker()
  const [loading, setLoading] = useState(false)
  const existingShow = getShowById(id)

  const fetchAllSeasons = useCallback(async () => {
    setLoading(true)

    const titleData = await omdbGetTitle(id)
    if (!titleData || titleData.Response === 'False') return

    const currentShow = computeOmdbShow(titleData)
    updateShow({ ...currentShow, seasons: existingShow?.seasons ?? [] })

    const capped = Math.max(0, Math.min(existingShow?.totalSeasons ?? 0, 30))
    const requests = Array.from({ length: capped }, (_, i) =>
      getSingleSeason(
        id,
        currentShow.title,
        existingShow?.seasons ?? [],
        i + 1,
      ),
    )
    const seasons = await Promise.all(requests)
    const filteredSeasons = seasons.filter(Boolean) as Season[]

    const futureTimestamps: number[] = []

    filteredSeasons.forEach((sn) =>
      sn.episodes.forEach((ep) => {
        if (ep.releaseDate) {
          const t = Date.parse(ep.releaseDate)
          if (!Number.isNaN(t) && t > Date.now()) futureTimestamps.push(t)
        }
      }),
    )

    const nextAirDate = futureTimestamps.length
      ? new Date(Math.min(...futureTimestamps)).toISOString()
      : undefined

    updateShow({
      ...currentShow,
      seasons: filteredSeasons,
      totalSeasons: capped || existingShow?.totalSeasons,
      nextAirDate,
    })

    setLoading(false)
  }, [updateShow, existingShow, id])

  return (
    <button
      className="text-blue-700 disabled:opacity-60 cursor-pointer"
      onClick={fetchAllSeasons}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? 'Fetching...' : 'Fetch seasons'}
    </button>
  )
}
