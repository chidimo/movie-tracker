import { normalizeShowTransfer } from '@movie-tracker/core'
import { importShows } from '@/lib/import-utils'
import { StorageRepo } from '@/lib/storage'
import type { Show } from '@movie-tracker/core'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useRef, useState } from 'react'

export const ImportSeries = ({ onUpdateState }: { onUpdateState: any }) => {
  const [importOpen, setImportOpen] = useState(false)
  const [importSelected, setImportSelected] = useState<Record<string, boolean>>(
    {},
  )
  const [importedShows, setImportedShows] = useState<Partial<Show>[]>([])
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
      let shows: any[] = []
      if (Array.isArray(json?.shows)) {
        shows = json.shows
      } else if (Array.isArray(json)) {
        shows = json
      }
      const normalized: Partial<Show>[] = shows.map((s: any) =>
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

  return (
    <div>
      <button className="px-3 py-1 rounded bg-gray-200" onClick={openImport}>
        Import
      </button>

      <Dialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto w-full max-w-lg rounded bg-white p-6">
            <DialogTitle className="text-lg font-semibold mb-3">
              Import shows
            </DialogTitle>
            <div className="mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={(e) => onImportFileChange(e.target.files?.[0])}
              />
            </div>
            {fileError ? (
              <p className="text-sm text-red-600 mb-2">{fileError}</p>
            ) : null}
            {importedShows.length > 0 ? (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <input
                    id="import-select-all"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={importedShows.every(
                      (s) => s.imdbId && importSelected[s.imdbId],
                    )}
                    onChange={(e) => toggleAllImport(e.target.checked)}
                  />
                  <label htmlFor="import-select-all" className="text-sm">
                    Select all
                  </label>
                </div>
                <ul className="max-h-64 overflow-auto border rounded">
                  {importedShows.map((s) => (
                    <li
                      key={s.imdbId || Math.random()}
                      className="flex items-center justify-between gap-2 p-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
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
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gray-700">
                Choose a JSON file exported from this app.
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setImportOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                onClick={confirmImport}
                disabled={
                  importedShows.length === 0 ||
                  !importedShows.some(
                    (s) => s.imdbId && importSelected[s.imdbId],
                  )
                }
              >
                Import Selected
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
