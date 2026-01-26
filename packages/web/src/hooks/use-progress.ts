import type { Season } from '@movie-tracker/core'
import { useSeriesTracker } from '@/context/series-tracker-context'

export type BaseProgressProps = {
  label?: string
  showFraction?: boolean
  showPercentage?: boolean
}

export type SeriesProgressProps = BaseProgressProps & {
  seriesId: string
  season?: never
}

export type SeasonProgressProps = BaseProgressProps & {
  seriesId?: never
  season: Season
}

export type ProgressProps = SeriesProgressProps | SeasonProgressProps

export type ProgressResult = {
  watched: number
  total: number
  percentage: number
  label: string
  showFraction: boolean
  showPercentage: boolean
}

export function useProgress(props: ProgressProps): ProgressResult {
  const { getShowProgress } = useSeriesTracker()
  
  let watched = 0
  let total = 0

  if ('season' in props && props.season) {
    // Calculate progress for a specific season
    total = props.season.episodes.length
    watched = props.season.episodes.filter((e) => e.watched).length
  } else if ('seriesId' in props && props.seriesId) {
    // Calculate progress for the entire series
    const progress = getShowProgress(props.seriesId)
    watched = progress.watched
    total = progress.total
  }

  const safeTotal = Math.max(0, total || 0)
  const safeCurrent = Math.min(Math.max(0, watched || 0), safeTotal)
  const percentage = safeTotal ? Math.round((safeCurrent / safeTotal) * 100) : 0

  const label = props.label || ('season' in props ? 'Progress' : 'Overall progress')
  const showFraction = props.showFraction ?? true
  const showPercentage = props.showPercentage ?? true

  return {
    watched: safeCurrent,
    total: safeTotal,
    percentage,
    label,
    showFraction,
    showPercentage,
  }
}
