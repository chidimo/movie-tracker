import { getCommonArtists } from '@/lib/aggregate-artists'
import { useSeriesTracker } from '@/context/series-tracker-context'

export const CommonArtists = () => {
  const { state } = useSeriesTracker()
  const commonArtists = getCommonArtists(state.shows)

  if (commonArtists.length === 0) {
    return null
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-blue-900">
        Common Artists Across Your Shows
      </h3>
      <div className="space-y-2">
        {commonArtists.slice(0, 5).map((artist) => (
          <div key={artist.name} className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-800">{artist.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-600">appears in {artist.count} shows</span>
              <div className="flex gap-1">
                {artist.shows.slice(0, 3).map((showTitle, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {showTitle.length > 15 ? `${showTitle.slice(0, 15)}...` : showTitle}
                  </span>
                ))}
                {artist.shows.length > 3 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    +{artist.shows.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {commonArtists.length > 5 && (
        <div className="mt-3 text-sm text-blue-600">
          ...and {commonArtists.length - 5} more common artists
        </div>
      )}
    </div>
  )
}
