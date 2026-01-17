import { useEffect, useState } from 'react'
import { FetchSeasons } from './fetch-seasons'
import { ScheduleSetter } from './schedule-setter'
import { SeasonContainer } from './season-container'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { Progress } from '@/components/progress'
import { UpcomingBanner } from '@/components/series-tracker/upcoming'
import { Link, useMatch } from '@tanstack/react-router'
import { Switcher } from '../switcher'
import { CastDisplay } from '../cast-display'
import { RatingsDisplay } from '../series-tracker/ratings-display'

export const SeriesDetailPage = () => {
  const { params } = useMatch({ from: '/$imdbId' })
  const imdbId = params.imdbId

  const { getShowById, getShowProgress } = useSeriesTracker()
  const [hideWatched, setHideWatched] = useState(false)

  const show = getShowById(imdbId)
  const showProgress = getShowProgress(imdbId)

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
      <div className="flex gap-4 mb-6">
        {show.thumbnail && show.thumbnail !== 'N/A' ? (
          <img
            src={show.thumbnail}
            alt="poster"
            className="h-40 w-28 object-cover rounded md:h-60 md:w-40"
          />
        ) : (
          <div className="h-40 w-28 bg-gray-200 rounded md:h-60 md:w-40" />
        )}
        <div className="flex-1 space-y-2">
          <UpcomingBanner show={show} className="" />
          <h1 className="text-2xl font-bold">{show.title}</h1>
          {show.releaseYear ? (
            <div className="text-sm text-gray-600">{show.releaseYear}</div>
          ) : null}
          {show.plot ? <p className="text-gray-700">{show.plot}</p> : null}
          <CastDisplay cast={show.mainCast} />
          <RatingsDisplay rating={show.rating} votes={show.votes} />
          <Progress
            className="mt-3"
            label="Overall progress"
            current={showProgress.watched}
            total={showProgress.total}
            showFraction
            showPercentage
          />
          <div className="mt-3 flex gap-3">
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
            <FetchSeasons id={show.imdbId} />
            <ScheduleSetter show={show} />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Seasons</h2>
          <Switcher
            label="Hide watched episodes"
            checked={hideWatched}
            onChange={(checked) => setHideWatched(checked)}
          />
        </div>
        {!show.seasons || show.seasons.length === 0 ? (
          <p className="text-gray-700">
            No seasons loaded yet. Click &quot;Fetch seasons&quot; above.
          </p>
        ) : (
          <div className="space-y-6">
            {[...show.seasons]
              .sort((a, b) => (b.seasonNumber ?? 0) - (a.seasonNumber ?? 0))
              .map((s) => (
                <SeasonContainer
                  key={s.seasonNumber ?? s.title}
                  season={s}
                  show={show}
                  hideWatched={hideWatched}
                />
              ))}
          </div>
        )}
      </div>
    </main>
  )
}
