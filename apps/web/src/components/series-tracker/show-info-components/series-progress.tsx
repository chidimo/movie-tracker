import type { ProgressProps } from '@/hooks/use-progress'
import { useProgress } from '@/hooks/use-progress'

type BaseProps = {
  className?: string
  barHeightClassName?: string
}

type SeriesComponentProps = BaseProps & ProgressProps

export const SeriesProgress = ({
  seriesId,
  season,
  label,
  className,
  barHeightClassName = 'h-2',
  showFraction,
  showPercentage,
}: SeriesComponentProps) => {
  const progress = useProgress(
    season
      ? { season, label, showFraction, showPercentage }
      : { seriesId, label, showFraction, showPercentage },
  )

  return (
    <div className={className}>
      <div className="text-xs text-gray-600 mb-1">
        {progress.label ? (
          <span className="font-medium">{progress.label}: </span>
        ) : null}
        {progress.showFraction ? (
          <span>
            {progress.watched}/{progress.total}
          </span>
        ) : null}
        {progress.showFraction && progress.showPercentage ? (
          <span> · </span>
        ) : null}
        {progress.showPercentage ? <span>{progress.percentage}%</span> : null}
      </div>
      <div
        className={`${barHeightClassName} w-full bg-gray-200 rounded overflow-hidden`}
      >
        <div
          className="h-full bg-green-600"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  )
}
