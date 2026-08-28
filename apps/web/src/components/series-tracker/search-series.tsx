import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSeriesTracker } from '../../context/series-tracker-context'
import type { OmdbSearchItem } from '@movie-tracker/core'
import {
  useOmdbTitleMutation,
  useSearchSeries,
} from '@/hooks/use-movies-legacy'
import { Button } from '@/components/ui/button'

export const SearchSeries = () => {
  const [q, setQ] = useState('')
  const { state, addShow } = useSeriesTracker()

  const { data, isFetching, refetch, error, isError } = useSearchSeries(q, {
    enabled: false,
  })

  const results = data ?? []

  const onSearch = async () => {
    if (!q.trim()) return
    refetch()
  }

  const { mutateAsync: fetchTitle, isPending } = useOmdbTitleMutation()

  const onAdd = async (item: OmdbSearchItem) => {
    const full = await fetchTitle(item.imdbID)
    if (!full) return
    addShow(full)
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

      {results.length > 0 ? (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Results
          </h3>
          <ul className="space-y-2">
            {results.map((r) => {
              const isAdded = state.shows.some((s) => s.imdbId === r.imdbID)
              return (
                <li
                  key={r.imdbID}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-2"
                >
                  <div className="flex items-center gap-3">
                    {r.Poster && r.Poster !== 'N/A' ? (
                      <img
                        src={r.Poster}
                        alt=""
                        className="h-16 w-11 rounded object-cover"
                      />
                    ) : (
                      <div className="h-16 w-11 rounded bg-muted" />
                    )}
                    <div>
                      <div className="text-sm font-semibold">{r.Title}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.Year}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isAdded ? 'secondary' : 'primary'}
                    onClick={() => onAdd(r)}
                    disabled={isAdded || isPending}
                  >
                    {isAdded ? 'Added' : isPending ? 'Adding…' : 'Add'}
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
