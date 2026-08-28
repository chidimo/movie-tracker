import { XMarkIcon } from '@heroicons/react/24/outline'
import { filterSearchResults } from '@movie-tracker/core'
import { useSeriesTracker } from '../../context/series-tracker-context'
import type { OmdbSearchItem } from '@movie-tracker/core'
import {
  useOmdbTitleMutation,
  useSearchSeries,
} from '@/hooks/use-movies-legacy'
import { Button } from '@/components/ui/button'

const posterOf = (poster?: string) =>
  poster && poster !== 'N/A' ? poster : undefined

type Props = {
  query: string
  onQueryChange: (value: string) => void
}

export const SearchSeries = ({ query, onQueryChange }: Props) => {
  const { state, addShow } = useSeriesTracker()

  const { data, isFetching, refetch, error, isError } = useSearchSeries(query, {
    enabled: false,
  })

  const newResults = filterSearchResults(data ?? [], state.shows)

  const onSearch = () => {
    if (!query.trim()) return
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
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Filter your shows, or search to add a new one"
            className="h-10 w-full rounded-md border border-input bg-background px-3 pr-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onQueryChange('')}
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

      {newResults.length > 0 ? (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Add from search
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
