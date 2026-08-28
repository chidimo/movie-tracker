import { useState } from 'react'
import { normalizeShowTransfer } from '@movie-tracker/core'
import type { Show } from '@movie-tracker/core'
import { Button } from '@/components/ui/button'
import { DialogShell } from '@/components/ui/dialog'

export const ExportSeries = ({ state }: { state: any }) => {
  const [exportOpen, setExportOpen] = useState(false)
  const [exportSelected, setExportSelected] = useState<Record<string, boolean>>(
    {},
  )
  const [includeEpisodes, setIncludeEpisodes] = useState(false)

  const openExport = () => {
    const sel: Record<string, boolean> = {}
    for (const s of state.shows) sel[s.imdbId] = true
    setExportSelected(sel)
    setExportOpen(true)
  }

  const toggleAllExport = (checked: boolean) => {
    const sel: Record<string, boolean> = {}
    for (const s of state.shows) sel[s.imdbId] = checked
    setExportSelected(sel)
  }

  const confirmExport = () => {
    const payload = {
      shows: state.shows
        .filter((s: Show) => exportSelected[s.imdbId])
        .map((s: Show) => normalizeShowTransfer(s, { includeEpisodes })),
      exportedAt: new Date().toISOString(),
      format: 'series-tracker.v1',
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'series-tracker-export.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  const selectedCount = state.shows.filter(
    (s: Show) => exportSelected[s.imdbId],
  ).length

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={openExport}
        disabled={state.shows.length === 0}
      >
        Export
      </Button>

      <DialogShell
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export shows"
        className="max-w-lg"
      >
        {state.shows.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No shows to export.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={state.shows.every(
                  (s: Show) => exportSelected[s.imdbId],
                )}
                onChange={(e) => toggleAllExport(e.target.checked)}
              />
              Select all
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={includeEpisodes}
                onChange={(e) => setIncludeEpisodes(e.target.checked)}
              />
              Include episodes
            </label>

            <ul className="max-h-64 divide-y divide-border overflow-auto rounded-lg border border-border">
              {state.shows.map((s: Show) => (
                <li
                  key={s.imdbId}
                  className="flex items-center gap-2 p-2.5"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={!!exportSelected[s.imdbId]}
                    onChange={(e) =>
                      setExportSelected((prev) => ({
                        ...prev,
                        [s.imdbId]: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setExportOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmExport} disabled={selectedCount === 0}>
            Download JSON
          </Button>
        </div>
      </DialogShell>
    </>
  )
}
