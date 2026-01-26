import { useState, useRef, useEffect } from 'react'
import type { Show } from '@movie-tracker/core'
import { RemoveShow } from './remove-show'
import {
  MoveToTopButton,
  OpenIMDbButton,
  ViewDetailsButton,
} from './card-menu-buttons'

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
        className="p-1 bg-white rounded border border-gray-300 hover:bg-gray-50 shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        title="More options"
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
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded border border-gray-200 shadow-lg z-50">
          <div className="py-1">
            <MoveToTopButton show={show} onClick={closeMenu} />
            <OpenIMDbButton show={show} onClick={closeMenu} />
            <ViewDetailsButton show={show} onClick={closeMenu} />
            <hr className="my-1 border-gray-200" />
            <RemoveShow showId={show.imdbId} onRemove={onRemoveShow} />
          </div>
        </div>
      )}
    </div>
  )
}
