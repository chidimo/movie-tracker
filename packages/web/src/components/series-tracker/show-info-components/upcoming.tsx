import type { Show } from '@/lib/types'
import { findUpcomingForShow } from '@/lib/upcoming'
import { formatTentative, getPaddedNumber } from '@/lib/utils'

export const UpcomingRibbon = ({
  show,
  className = '',
}: {
  show?: Show
  className?: string
}) => {
  const upcoming = findUpcomingForShow(show)
  if (!upcoming) return null
  const s = getPaddedNumber(upcoming.seasonNumber)
  const e = getPaddedNumber(upcoming.episodeNumber)
  const code = s && e ? `S${s}.E${e}` : 'Soon'
  return (
    <div
      className={`bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm shadow ${className}`}
    >
      {code}
    </div>
  )
}

export const UpcomingBanner = ({
  show,
  className = '',
}: {
  show?: Show
  className?: string
}) => {
  const upcoming = findUpcomingForShow(show)
  if (!upcoming) return null
  const dateStr = new Date(upcoming.dateISO).toISOString()
  const padSeason = getPaddedNumber(upcoming.seasonNumber)
  const padEpisode = getPaddedNumber(upcoming.episodeNumber)
  const code =
    padSeason && padEpisode ? `S${padSeason}.E${padEpisode}` : undefined
  const title = upcoming.title || 'Upcoming episode'

  return (
    <div
      className={`w-fit mb-2 rounded border border-blue-200 bg-blue-50 text-blue-800 px-2 py-1 text-xs ${className}`}
    >
      <span className="font-semibold">Upcoming:</span>{' '}
      {code ? <span className="font-mono mr-1">{code}</span> : null}
      <span>{`${title} – ${formatTentative(dateStr)}`}</span>
    </div>
  )
}
