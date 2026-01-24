import { useSeriesTracker } from '@/context/series-tracker-context'
import type { Season } from '@/lib/series-tracker/types'

type BaseProps = {
  label?: string
  className?: string
  barHeightClassName?: string
  showFraction?: boolean
  showPercentage?: boolean
}

type SeriesProps = BaseProps & {
  seriesId: string
  season?: never
}

type SeasonProps = BaseProps & {
  seriesId?: never
  season: Season
}

type Props = SeriesProps | SeasonProps

export const SeriesProgress = ({
  seriesId,
  season,
  label = 'Overall progress',
  className,
  barHeightClassName = 'h-2',
  showFraction = true,
  showPercentage = true,
}: Props) => {
  const { getShowProgress } = useSeriesTracker()

  let watched = 0
  let total = 0

  if (season) {
    // Calculate progress for a specific season
    total = season.episodes.length
    watched = season.episodes.filter((e) => e.watched).length
  } else if (seriesId) {
    // Calculate progress for the entire series
    const progress = getShowProgress(seriesId)
    watched = progress.watched
    total = progress.total
  }

  const safeTotal = Math.max(0, total || 0)
  const safeCurrent = Math.min(Math.max(0, watched || 0), safeTotal)
  const pct = safeTotal ? Math.round((safeCurrent / safeTotal) * 100) : 0

  return (
    <div className={className}>
      <div className="text-xs text-gray-600 mb-1">
        {label ? <span className="font-medium">{label}: </span> : null}
        {showFraction ? (
          <span>
            {safeCurrent}/{safeTotal}
          </span>
        ) : null}
        {showFraction && showPercentage ? <span> · </span> : null}
        {showPercentage ? <span>{pct}%</span> : null}
      </div>
      <div
        className={`${barHeightClassName} w-full bg-gray-200 rounded overflow-hidden`}
      >
        <div className="h-full bg-green-600" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// Export a SeasonProgress alias for backward compatibility
export const SeasonProgress = (props: SeasonProps) => (
  <SeriesProgress {...props} label={props.label || 'Progress'} />
)
