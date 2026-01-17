import { ProfileModal } from '@/components/series-tracker/profile-modal'
import { ExportSeries } from '@/components/series-tracker/export-series'
import { ImportSeries } from '@/components/series-tracker/import-series'
import { ShowCard } from '@/components/series-tracker/show-card'
import { SearchSeries } from '@/components/series-tracker/search-series'
import { useSeriesTracker } from '@/context/series-tracker-context'
import type { TrackerState } from '@/lib/series-tracker/types'

export const SeriesTrackerPage = () => {
  const { state, removeShow, replaceState } = useSeriesTracker()

  const handleRemoveShow = (removeId: string) => {
    removeShow(removeId)
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
        {state.shows.length === 0 ? (
          <p className="text-gray-600">
            No shows yet. Search above and add one.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.shows.map((s) => (
              <ShowCard
                key={s.imdbId}
                show={s}
                onRemoveShow={handleRemoveShow}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
