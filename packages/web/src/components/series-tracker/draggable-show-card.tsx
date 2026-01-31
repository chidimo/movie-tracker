import { useState } from 'react'
import { CardMenu } from './card-menu'
import {
  CastDisplay,
  RatingsDisplay,
  SeriesProgress,
} from './show-info-components'
import type { Show } from '@movie-tracker/core'

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

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    onDrop(e, index)
  }

  return (
    <li
      className={`relative border border-gray-300 rounded p-3 transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${dragOver ? 'border-blue-500 shadow-lg' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <CardMenu show={show} onRemoveShow={onRemoveShow} />
      </div>

      <div className="flex gap-3">
        <div className="relative">
          {show.thumbnail && show.thumbnail !== 'N/A' ? (
            <img
              src={show.thumbnail}
              alt="poster"
              className="h-24 w-16 object-cover rounded md:h-40 md:w-28"
            />
          ) : (
            <div className="h-24 w-16 bg-gray-200 rounded md:h-40 md:w-28" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="font-semibold pr-8">{show.title}</div>

          {show.releaseYear ? (
            <div className="text-xs text-gray-600">{show.releaseYear}</div>
          ) : null}

          {show.plot ? (
            <div className="text-xs text-gray-700 line-clamp-3">
              {show.plot}
            </div>
          ) : null}

          <CastDisplay cast={show.mainCast} />

          <RatingsDisplay rating={show.rating} votes={show.votes} />

          <SeriesProgress
            seriesId={show.imdbId}
            className="mt-3"
            showFraction={true}
            showPercentage={true}
          />
        </div>
      </div>
    </li>
  )
}
