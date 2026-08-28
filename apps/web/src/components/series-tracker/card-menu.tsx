import { useEffect, useRef, useState } from 'react'
import { RemoveShow } from './remove-show'
import {
  MoveToTopButton,
  OpenIMDbButton,
  ViewDetailsButton,
} from './card-menu-buttons'
import type { Show } from '@movie-tracker/core'

type Props = {
  show: Show
  onRemoveShow: (removeId: string) => void
}

export const CardMenu = ({ show, onRemoveShow }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setIsOpen(!isOpen)}
        title="More options"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="py-1">
            <MoveToTopButton show={show} onClick={closeMenu} />
            <OpenIMDbButton show={show} onClick={closeMenu} />
            <ViewDetailsButton show={show} onClick={closeMenu} />
            <hr className="my-1 border-border" />
            <RemoveShow showId={show.imdbId} onRemove={onRemoveShow} />
          </div>
        </div>
      )}
    </div>
  )
}
