import { useCallback, useEffect, useRef, useState } from 'react'
import { createWebOmdbFunctions, normalizeOmdbShow } from '@movie-tracker/core'
import type { Episode, Season } from '@movie-tracker/core'
import { useSeriesTracker } from '@/context/series-tracker-context'

const { omdbGetSeason, omdbGetTitle } = createWebOmdbFunctions({
  omdbFunctionPath: import.meta.env.DEV ? '/api/omdb' : '/.netlify/functions/omdb'
})

const getSingleSeason = async (
  id: string,
  showTitle: string,
  seasons: Array<Season>,
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

  const eps: Array<Episode> = (data.Episodes || []).map((ep) => {
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

export const useFetchSeasons = (imdbId: string) => {
  const { updateShow, getShowById } = useSeriesTracker()
  const [loading, setLoading] = useState(false)
  const hasFetched = useRef(false)

  const fetchAllSeasons = useCallback(async () => {
    if (hasFetched.current) return
    hasFetched.current = true

    setLoading(true)

    const titleData = await omdbGetTitle(imdbId)
    if (!titleData || titleData.Response === 'False') return

    const fetchedShow = normalizeOmdbShow(titleData)
    const currentExistingShow = getShowById(imdbId)

    updateShow({ ...fetchedShow, seasons: currentExistingShow?.seasons ?? [] })

    const capped = Math.max(
      0,
      Math.min(
        currentExistingShow?.totalSeasons ?? fetchedShow.totalSeasons ?? 0,
        30,
      ),
    )
    const requests = Array.from({ length: capped }, (_, i) =>
      getSingleSeason(
        imdbId,
        fetchedShow.title,
        currentExistingShow?.seasons ?? [],
        i + 1,
      ),
    )
    const seasons = await Promise.all(requests)
    const filteredSeasons = seasons.filter(Boolean) as Array<Season>

    const futureTimestamps: Array<number> = []

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
      ...fetchedShow,
      seasons: filteredSeasons,
      totalSeasons: capped || currentExistingShow?.totalSeasons,
      nextAirDate,
    })

    setLoading(false)
  }, [updateShow, getShowById, imdbId])

  useEffect(() => {
    fetchAllSeasons()
  }, [fetchAllSeasons])

  return { fetchingSeasons: loading }
}
