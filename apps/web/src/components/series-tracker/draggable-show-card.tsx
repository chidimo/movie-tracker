import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CardMenu } from './card-menu'
import {
  CastDisplay,
  RatingsDisplay,
  SeriesProgress,
} from './show-info-components'
import type { Show } from '@movie-tracker/core'
import { mergeClasses as cn } from '@/lib/class-merge'

type Props = {
  show: Show
  index: number
  isDragging: boolean
  onRemoveShow: (removeId: string) => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, index: number) => void
}

export const DraggableShowCard = ({
  show,
  index,
  isDragging,
  onRemoveShow,
  onDragStart,
  onDragOver,
  onDrop,
}: Props) => {
  const [dragOver, setDragOver] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    onDragOver(e)
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    onDrop(e, index)
  }

  return (
    <li
      className={cn(
        'group relative rounded-xl border border-border bg-card p-4 shadow-sm transition-all',
        'hover:border-foreground/20 hover:shadow-md',
        isDragging && 'opacity-40',
        dragOver && 'border-ring ring-2 ring-ring',
      )}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <CardMenu show={show} onRemoveShow={onRemoveShow} />
      </div>

      <div className="flex gap-4">
        <Link
          to="/$imdbId"
          params={{ imdbId: show.imdbId }}
          className="shrink-0"
        >
          {show.thumbnail && show.thumbnail !== 'N/A' ? (
            <img
              src={show.thumbnail}
              alt=""
              className="h-36 w-24 rounded-lg object-cover"
            />
          ) : (
            <div className="h-36 w-24 rounded-lg bg-muted" />
          )}
        </Link>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="pr-6">
            <Link
              to="/$imdbId"
              params={{ imdbId: show.imdbId }}
              className="font-semibold leading-tight hover:underline"
            >
              {show.title}
            </Link>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              {show.releaseYear ? <span>{show.releaseYear}</span> : null}
              <RatingsDisplay rating={show.rating} votes={show.votes} />
            </div>
          </div>

          {show.plot ? (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {show.plot}
            </p>
          ) : null}

          <CastDisplay cast={show.mainCast} />

          <SeriesProgress
            seriesId={show.imdbId}
            className="pt-1"
            showFraction
            showPercentage
          />
        </div>
      </div>
    </li>
  )
}
