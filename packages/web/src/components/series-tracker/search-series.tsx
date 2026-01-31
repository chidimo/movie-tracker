import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSeriesTracker } from '../../context/series-tracker-context'
import type { OmdbSearchItem } from '@movie-tracker/core'
import { useOmdbTitleMutation, useSearchSeries } from '@/hooks/use-movies-legacy'

export const SearchSeries = () => {
  const [q, setQ] = useState('')
  const { state, addShow } = useSeriesTracker()

  const { data, isFetching, refetch, error, isError } = useSearchSeries(q, {
    enabled: false,
  })

  const results = (data) ?? []

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
    <div className="mb-8">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for a TV series"
            className="w-full border border-gray-300 focus:border-blue-600 rounded px-3 py-2 pr-9"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          {q ? (
            <button
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setQ('')}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          ) : null}
        </div>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60 focus:ring-blue-600 focus:ring-1"
          onClick={onSearch}
          disabled={isFetching}
        >
          {isFetching ? 'Searching...' : 'Search'}
        </button>
      </div>
      {isError ? (
        <p className="text-red-600 mt-2 text-sm">{String(error)}</p>
      ) : null}
      {results.length > 0 ? (
        <div className="mt-3">
          <h3 className="font-medium mb-2">Results</h3>
          <ul className="space-y-2">
            {results.map((r) => {
              const isAdded = state.shows.some((s) => s.imdbId === r.imdbID)
              return (
                <li
                  key={r.imdbID}
                  className="flex items-center justify-between gap-3 border border-gray-300 rounded p-2"
                >
                  <div className="flex items-center gap-3">
                    {r.Poster && r.Poster !== 'N/A' ? (
                      <img
                        src={r.Poster}
                        alt="poster"
                        className="h-12 w-8 object-cover rounded md:h-16 md:w-12"
                      />
                    ) : null}
                    <div>
                      <div className="font-semibold">{r.Title}</div>
                      <div className="text-xs text-gray-600">{r.Year}</div>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-60"
                    onClick={() => onAdd(r)}
                    disabled={isAdded || isPending}
                  >
                    {isAdded || isPending ? 'Added' : 'Add'}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
