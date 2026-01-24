import { useSeriesTracker } from '@/context/series-tracker-context'
import type { Show } from '@/lib/series-tracker/types'

type Props = {
  show: Show
  onClick?: () => void
}

export const MoveToTopButton = ({ show, onClick }: Props) => {
  const { moveShowToTop } = useSeriesTracker()

  const handleClick = () => {
    moveShowToTop(show.imdbId)
    onClick?.()
  }

  return (
    <button
      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
      onClick={handleClick}
    >
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
      Move to top
    </button>
  )
}
