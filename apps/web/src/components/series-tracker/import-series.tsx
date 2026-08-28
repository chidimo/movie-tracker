import { normalizeShowTransfer } from '@movie-tracker/core'
import { useRef, useState } from 'react'
import type { Show } from '@movie-tracker/core'
import { importShows } from '@/lib/import-utils'
import { StorageRepo } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { DialogShell } from '@/components/ui/dialog'

export const ImportSeries = ({ onUpdateState }: { onUpdateState: any }) => {
  const [importOpen, setImportOpen] = useState(false)
  const [importSelected, setImportSelected] = useState<Record<string, boolean>>(
    {},
  )
  const [importedShows, setImportedShows] = useState<Array<Partial<Show>>>([])
  const [fileError, setFileError] = useState<string | undefined>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const openImport = () => {
    setImportedShows([])
    setImportSelected({})
    setFileError(undefined)
    setImportOpen(true)
  }

  const onImportFileChange = async (file?: File | null) => {
    try {
      setFileError(undefined)
      if (!file) return
      const text = await file.text()
      const json = JSON.parse(text || '{}')
      let shows: Array<any> = []
      if (Array.isArray(json?.shows)) {
        shows = json.shows
      } else if (Array.isArray(json)) {
        shows = json
      }
      const normalized: Array<Partial<Show>> = shows.map((s: any) =>
        normalizeShowTransfer(s, { includeEpisodes: true }),
      )
      const sel: Record<string, boolean> = {}
      for (const s of normalized)
        if (s.imdbId) {
          sel[s.imdbId] = true
        }
      setImportedShows(normalized)
      setImportSelected(sel)
    } catch (e) {
      console.error('Failed to parse import file', e)
      setFileError(
        'Invalid file format. Expecting a JSON export from this app.',
      )
      setImportedShows([])
      setImportSelected({})
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const toggleAllImport = (checked: boolean) => {
    const sel: Record<string, boolean> = {}
    for (const s of importedShows) if (s.imdbId) sel[s.imdbId] = checked
    setImportSelected(sel)
  }

  const confirmImport = () => {
    const current = StorageRepo.getState()
    const nextState = importShows(current, importedShows, importSelected, {
      includeEpisodes: true,
    })
    StorageRepo.setState(nextState)
    onUpdateState(StorageRepo.getState())
    setImportOpen(false)
  }

  const selectedCount = importedShows.filter(
    (s) => s.imdbId && importSelected[s.imdbId],
  ).length

  return (
    <>
      <Button variant="secondary" size="sm" onClick={openImport}>
        Import
      </Button>

      <DialogShell
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import shows"
        className="max-w-lg"
      >
        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={(e) => onImportFileChange(e.target.files?.[0])}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
          />
        </div>

        {fileError ? (
          <p className="mt-2 text-sm text-destructive">{fileError}</p>
        ) : null}

        {importedShows.length > 0 ? (
          <>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={importedShows.every(
                  (s) => s.imdbId && importSelected[s.imdbId],
                )}
                onChange={(e) => toggleAllImport(e.target.checked)}
              />
              Select all
            </label>
            <ul className="mt-2 max-h-64 divide-y divide-border overflow-auto rounded-lg border border-border">
              {importedShows.map((s) => (
                <li
                  key={s.imdbId || Math.random()}
                  className="flex items-center gap-2 p-2.5"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={!!(s.imdbId && importSelected[s.imdbId])}
                    onChange={(e) =>
                      s.imdbId &&
                      setImportSelected((prev) => ({
                        ...prev,
                        [s.imdbId!]: e.target.checked,
                      }))
                    }
                  />
                  <span className="text-sm">{s.title || s.imdbId}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Choose a JSON file exported from this app.
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setImportOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmImport} disabled={selectedCount === 0}>
            Import{selectedCount > 0 ? ` ${selectedCount}` : ''}
          </Button>
        </div>
      </DialogShell>
    </>
  )
}
