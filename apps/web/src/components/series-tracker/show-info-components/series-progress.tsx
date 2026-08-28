import type { ProgressProps } from '@/hooks/use-progress'
import { mergeClasses as cn } from '@/lib/class-merge'
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
  barHeightClassName = 'h-1.5',
  showFraction,
  showPercentage,
}: SeriesComponentProps) => {
  const progress = useProgress(
    season
      ? { season, label, showFraction, showPercentage }
      : { seriesId, label, showFraction, showPercentage },
  )

  const complete = progress.total > 0 && progress.watched >= progress.total

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {progress.label ? (
            <span className="font-medium text-foreground">
              {progress.label}:{' '}
            </span>
          ) : null}
          {progress.showFraction ? (
            <span>
              {progress.watched}/{progress.total}
            </span>
          ) : null}
        </span>
        {progress.showPercentage ? (
          <span className={complete ? 'font-medium text-foreground' : ''}>
            {progress.percentage}%
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-muted',
          barHeightClassName,
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300',
            complete ? 'bg-primary' : 'bg-primary/70',
          )}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  )
}
