import { useEffect } from 'react'
import { Link, useMatch } from '@tanstack/react-router'
import { Switcher } from '../switcher'
import { ScheduleSetter } from './schedule-setter'
import { SeasonContainer } from './season-container'
import { CastDisplay } from './show-info-components/cast-display'
import {
  RatingsDisplay,
  SeriesProgress,
  UpcomingBanner,
} from './show-info-components'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { useFetchSeasons } from '@/hooks/use-fetch-seasons'

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
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Show not found in your list.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to tracker
        </Link>
      </div>
      <div className="mb-8 flex flex-col gap-6 md:flex-row">
        <div className="shrink-0">
          {show.thumbnail && show.thumbnail !== 'N/A' ? (
            <img
              src={show.thumbnail}
              alt=""
              className="w-full rounded-xl object-cover md:w-56"
            />
          ) : (
            <div className="aspect-2/3 w-full rounded-xl bg-muted md:w-56" />
          )}
        </div>
        <div className="flex-1 space-y-3">
          <UpcomingBanner show={show} className="" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {show.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {show.releaseYear ? <span>{show.releaseYear}</span> : null}
            <RatingsDisplay rating={show.rating} votes={show.votes} />
          </div>
          {show.plot ? (
            <p className="text-sm text-muted-foreground">{show.plot}</p>
          ) : null}
          <CastDisplay cast={show.mainCast} />
          <SeriesProgress
            seriesId={imdbId}
            className="max-w-sm"
            showFraction
            showPercentage
          />
          <div className="flex flex-wrap items-center gap-4 pt-1 text-sm font-medium">
            <a
              href={show.imdbUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Open on IMDb
            </a>
            <a
              href={imdbVideosUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Watch trailer
            </a>
            <ScheduleSetter show={show} />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Seasons</h2>
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
    </div>
  )
}
