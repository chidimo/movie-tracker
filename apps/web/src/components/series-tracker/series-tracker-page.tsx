import { useState } from 'react'
import type { TrackerState } from '@movie-tracker/core'
import { ProfileModal } from '@/components/series-tracker/profile-modal'
import { ExportSeries } from '@/components/series-tracker/export-series'
import { ImportSeries } from '@/components/series-tracker/import-series'
import { DraggableShowCard } from '@/components/series-tracker/draggable-show-card'
import { SearchSeries } from '@/components/series-tracker/search-series'
import { CommonArtists } from '@/components/series-tracker/show-info-components/common-artists'
import { useSeriesTracker } from '@/context/series-tracker-context'

export const SeriesTrackerPage = () => {
  const { state, removeShow, replaceState, getOrderedShows, reorderShows } =
    useSeriesTracker()
  const orderedShows = getOrderedShows()
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleRemoveShow = (removeId: string) => {
    removeShow(removeId)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderShows(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  return (
    <div>
      <ProfileModal />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">
          {state.profile?.name ? `${state.profile.name}!` : 'Welcome!'} 👋
        </h2>
        <p className="text-gray-600 mb-4">
          Track your favorite shows and see what&apos;s next.
        </p>
      </div>

      <SearchSeries />

      <CommonArtists />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Your Shows</h3>
          <div className="flex gap-2">
            <ImportSeries
              onUpdateState={(s: TrackerState) => replaceState(s)}
            />
            <ExportSeries state={state} />
          </div>
        </div>
        {orderedShows.length === 0 ? (
          <p className="text-gray-600">
            No shows yet. Search above and add one.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderedShows.map((show, index) => (
              <DraggableShowCard
                key={show.imdbId}
                show={show}
                index={index}
                onRemoveShow={handleRemoveShow}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedIndex === index}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
