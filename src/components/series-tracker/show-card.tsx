import { Link } from '@tanstack/react-router'
import { RemoveShow } from './remove-show'
import { UpcomingRibbon } from './upcoming'
import type { Show } from '@/lib/series-tracker/types'
import { CastDisplay } from '../cast-display'
import { RatingsDisplay } from './ratings-display'
import { Progress } from '../progress'
import { useSeriesTracker } from '../../context/series-tracker-context'

type Props = {
  show: Show
  onRemoveShow: (removeId: string) => void
}

export const ShowCard = ({ show, onRemoveShow }: Props) => {
  const { getShowProgress } = useSeriesTracker()
  const showProgress = getShowProgress(show.imdbId)

  return (
    <li className="relative border border-gray-300 rounded p-3">
      <RemoveShow showId={show.imdbId} onRemove={onRemoveShow} />
      <div className="flex gap-3">
        <div className="relative">
          {show.thumbnail && show.thumbnail !== 'N/A' ? (
            <img
              src={show.thumbnail}
              alt="poster"
              className="h-24 w-16 object-cover rounded md:h-40 md:w-28"
            />
          ) : (
            <div className="h-24 w-16 bg-gray-200 rounded md:h-40 md:w-28" />
          )}
          <UpcomingRibbon show={show} className="absolute top-1 left-1" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="font-semibold">{show.title}</div>
          {show.releaseYear ? (
            <div className="text-xs text-gray-600">{show.releaseYear}</div>
          ) : null}
          {show.plot ? (
            <div className="text-xs text-gray-700 line-clamp-3">
              {show.plot}
            </div>
          ) : null}
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

          {show.nextAirDate ? (
            <div
              className={
                'text-xs mt-1 ' +
                (Date.now() + 7 * 24 * 60 * 60 * 1000 >=
                new Date(show.nextAirDate).getTime()
                  ? 'text-green-700'
                  : 'text-gray-700')
              }
            >
              Next air date: {new Date(show.nextAirDate).toLocaleDateString()}
            </div>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            <Link
              to={show.imdbUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:underline text-sm"
            >
              Open on IMDb
            </Link>
            <Link
              to={show.imdbId}
              className="text-sm text-blue-700 hover:underline"
            >
              View details
            </Link>
            <div className="w-full" />
          </div>
        </div>
      </div>
    </li>
  )
}
