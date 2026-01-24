import { useSeriesTracker } from '@/context/series-tracker-context'

type Props = {
  seriesId: string
  label?: string
  className?: string
  barHeightClassName?: string
  showFraction?: boolean
  showPercentage?: boolean
}

export const SeriesProgress = ({
  seriesId,
  label = 'Overall progress',
  className,
  barHeightClassName = 'h-2',
  showFraction = true,
  showPercentage = true,
}: Props) => {
  const { getShowProgress } = useSeriesTracker()
  const { watched, total } = getShowProgress(seriesId)

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
