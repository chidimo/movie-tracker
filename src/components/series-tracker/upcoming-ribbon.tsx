import type { Show } from '@/lib/series-tracker/types'
import { findUpcomingForShow } from '@/lib/series-tracker/upcoming'
import { getPaddedNumber } from '@/lib/utils'

export const UpcomingRibbon = ({
  show,
  days = 3,
  className = '',
}: {
  show?: Show
  days?: number
  className?: string
}) => {
  const upcoming = findUpcomingForShow(show, days)
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
