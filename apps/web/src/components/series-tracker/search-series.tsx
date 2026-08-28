import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { filterSearchResults } from '@movie-tracker/core'
import { useSeriesTracker } from '../../context/series-tracker-context'
import type { OmdbSearchItem } from '@movie-tracker/core'
import {
  useOmdbTitleMutation,
  useSearchSeries,
} from '@/hooks/use-movies-legacy'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const posterOf = (poster?: string) =>
  poster && poster !== 'N/A' ? poster : undefined

export const SearchSeries = () => {
  const [q, setQ] = useState('')
  const { state, addShow } = useSeriesTracker()

  const { data, isFetching, refetch, error, isError } = useSearchSeries(q, {
    enabled: false,
  })

  const query = q.trim().toLowerCase()

  // Shows already in the library that match what's being typed — surfaced live.
  const libraryMatches = useMemo(() => {
    if (query.length < 2) return []
    return state.shows.filter((s) => s.title.toLowerCase().includes(query))
  }, [state.shows, query])

  // OMDB hits, deduped and minus anything already in the library (those show
  // in the "In your list" section above instead).
  const newResults = filterSearchResults(data ?? [], state.shows)

  const onSearch = () => {
    if (!q.trim()) return
    refetch()
  }

  const { mutateAsync: fetchTitle, isPending } = useOmdbTitleMutation()

  const onAdd = async (item: OmdbSearchItem) => {
    try {
      addShow(await fetchTitle(item.imdbID))
    } catch {
      // fetchTitle surfaces its own error state; nothing to add on failure
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a TV series"
            className="h-10 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          {q ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setQ('')}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          ) : null}
        </div>
        <Button size="md" onClick={onSearch} disabled={isFetching}>
          {isFetching ? 'Searching…' : 'Search'}
        </Button>
      </div>

      {isError ? (
        <p className="mt-2 text-sm text-destructive">{String(error)}</p>
      ) : null}

      {libraryMatches.length > 0 ? (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            In your list
          </h3>
          <ul className="space-y-2">
            {libraryMatches.map((s) => (
              <li
                key={s.imdbId}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {posterOf(s.thumbnail) ? (
                    <img
                      src={s.thumbnail}
                      alt=""
                      className="h-16 w-11 rounded object-cover"
                    />
                  ) : (
                    <div className="h-16 w-11 rounded bg-muted" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {s.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.releaseYear}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Added</Badge>
                  <Link to="/$imdbId" params={{ imdbId: s.imdbId }}>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {newResults.length > 0 ? (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Results
          </h3>
          <ul className="space-y-2">
            {newResults.map((r) => (
              <li
                key={r.imdbID}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {posterOf(r.Poster) ? (
                    <img
                      src={r.Poster}
                      alt=""
                      className="h-16 w-11 rounded object-cover"
                    />
                  ) : (
                    <div className="h-16 w-11 rounded bg-muted" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {r.Title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.Year}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAdd(r)}
                  disabled={isPending}
                >
                  {isPending ? 'Adding…' : 'Add'}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
