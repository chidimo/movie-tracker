import { useEffect } from 'react'
import { ScheduleSetter } from './schedule-setter'
import { SeasonContainer } from './season-container'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { Link, useMatch } from '@tanstack/react-router'
import { Switcher } from '../switcher'
import { CastDisplay } from './show-info-components/cast-display'
import { useFetchSeasons } from '@/hooks/use-fetch-seasons'
import {
  RatingsDisplay,
  SeriesProgress,
  UpcomingBanner,
} from './show-info-components'

export const SeriesDetailPage = () => {
  const { params } = useMatch({ from: '/$imdbId' })
  const imdbId = params.imdbId

  const { getShowById, updateShow } = useSeriesTracker()

  const show = getShowById(imdbId)
  useFetchSeasons(imdbId)

  useEffect(() => {
    if (show?.title) {
      document.title = `${show.title} – Popcorn Time`
    }
  }, [show?.title])

  const imdbVideosUrl = `https://www.imdb.com/title/${
    show?.imdbId ?? ''
  }/videogallery/`

  if (!show) {
    return (
      <main>
        <p className="text-gray-700">Show not found in your list.</p>
        <Link to="/" className="text-blue-700 hover:underline">
          ← Back
        </Link>
      </main>
    )
  }

  return (
    <main>
      <div className="mb-4">
        <Link to="/" className="text-blue-700 hover:underline">
          ← Back to tracker
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex justify-center md:justify-start">
          {show.thumbnail && show.thumbnail !== 'N/A' ? (
            <img
              src={show.thumbnail}
              alt="poster"
              className="object-cover rounded"
            />
          ) : (
            <div className="bg-gray-200 rounded" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <UpcomingBanner show={show} className="" />
          <h1 className="text-2xl font-bold">{show.title}</h1>
          {show.releaseYear ? (
            <div className="text-sm text-gray-600">{show.releaseYear}</div>
          ) : null}
          {show.plot ? <p className="text-gray-700">{show.plot}</p> : null}
          <CastDisplay cast={show.mainCast} />
          <RatingsDisplay rating={show.rating} votes={show.votes} />
          <SeriesProgress
            seriesId={imdbId}
            showFraction={true}
            showPercentage={true}
          />
          <div className="flex gap-3">
            <a
              href={show.imdbUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:underline"
            >
              Open on IMDb
            </a>
            <a
              href={imdbVideosUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:underline"
            >
              Watch trailer
            </a>
            <ScheduleSetter show={show} />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Seasons</h2>
          <Switcher
            label="Hide watched episodes"
            checked={show?.hideWatched ?? false}
            onChange={(checked) =>
              updateShow({ ...show, hideWatched: checked })
            }
          />
        </div>

        <div className="space-y-6">
          {[...show.seasons]
            .sort((a, b) => (b.seasonNumber ?? 0) - (a.seasonNumber ?? 0))
            .map((s) => (
              <SeasonContainer
                key={s.seasonNumber ?? s.title}
                season={s}
                show={show}
                hideWatched={show?.hideWatched ?? false}
              />
            ))}
        </div>
      </div>
    </main>
  )
}
