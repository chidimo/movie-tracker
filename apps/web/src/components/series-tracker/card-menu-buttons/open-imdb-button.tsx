import type { Show } from '@movie-tracker/core'

type Props = {
  show: Show
  onClick?: () => void
}

export const OpenIMDbButton = ({ show, onClick }: Props) => {
  const handleClick = () => {
    globalThis.open(show.imdbUrl, '_blank')
    onClick?.()
  }

  return (
    <button
      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
      onClick={handleClick}
    >
      <svg
        className="w-4 h-4 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
      Open on IMDb
    </button>
  )
}
