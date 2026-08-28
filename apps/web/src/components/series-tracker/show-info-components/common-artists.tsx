import { getCommonArtists } from '@movie-tracker/core'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { Badge } from '@/components/ui/badge'

export const CommonArtists = () => {
  const { state } = useSeriesTracker()
  const commonArtists = getCommonArtists(state.shows)

  if (commonArtists.length === 0) return null

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-3 text-lg font-semibold tracking-tight">
        Artists across your shows
      </h2>
      <ul className="divide-y divide-border">
        {commonArtists.slice(0, 5).map((artist) => (
          <li
            key={artist.name}
            className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm first:pt-0 last:pb-0"
          >
            <span className="font-medium">{artist.name}</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">
                {artist.frequency}{' '}
                {artist.frequency === 1 ? 'show' : 'shows'}
              </span>
              {artist.shows.slice(0, 3).map((showTitle) => (
                <Badge key={`${artist.name}-${showTitle}`} variant="secondary">
                  {showTitle.length > 18
                    ? `${showTitle.slice(0, 18)}…`
                    : showTitle}
                </Badge>
              ))}
              {artist.shows.length > 3 && (
                <Badge variant="outline">+{artist.shows.length - 3}</Badge>
              )}
            </div>
          </li>
        ))}
      </ul>
      {commonArtists.length > 5 && (
        <p className="mt-3 text-xs text-muted-foreground">
          and {commonArtists.length - 5} more
        </p>
      )}
    </section>
  )
}
