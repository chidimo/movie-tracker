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
    <div className="space-y-8">
      <ProfileModal />

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {state.profile?.name ? `Hey, ${state.profile.name}` : 'Welcome'} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your favorite shows and see what&apos;s next.
        </p>
      </div>

      <SearchSeries />

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Your Shows
            {orderedShows.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {orderedShows.length}
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            <ImportSeries
              onUpdateState={(s: TrackerState) => replaceState(s)}
            />
            <ExportSeries state={state} />
          </div>
        </div>

        {orderedShows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              No shows yet — search above to add your first one.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
      </section>

      <CommonArtists />
    </div>
  )
}
