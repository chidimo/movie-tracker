import { useMemo, useState } from 'react'
import type { Show } from '@movie-tracker/core'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { Button } from '@/components/ui/button'
import { DialogShell } from '@/components/ui/dialog'

const fieldClass =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring'

export const ScheduleSetter = ({ show }: { show: Show }) => {
  const { updateShow } = useSeriesTracker()
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [schedDate, setSchedDate] = useState<string>('')
  const [schedTarget, setSchedTarget] = useState<string>('') // key: s{season}-e{episode}
  const [schedFreq, setSchedFreq] = useState<number>(7)

  const mostRecentSeasonNumber = useMemo(() => {
    const nums = (show?.seasons || [])
      .map((s) => s.seasonNumber)
      .filter((n): n is number => typeof n === 'number')
    return nums.length ? Math.max(...nums) : undefined
  }, [show])

  const allEpisodesFlat = useMemo(() => {
    if (!show || typeof mostRecentSeasonNumber !== 'number')
      return [] as Array<{
        seasonNumber: number
        episodeNumber: number
        title: string
      }>
    const sn = (show.seasons || []).find(
      (s) => s.seasonNumber === mostRecentSeasonNumber,
    )
    if (!sn)
      return [] as Array<{
        seasonNumber: number
        episodeNumber: number
        title: string
      }>
    const eps = [...(sn.episodes || [])]
      .filter((e) => typeof e.episodeNumber === 'number')
      .sort((a, b) => (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0))
    return eps.map((e) => ({
      seasonNumber: mostRecentSeasonNumber,
      episodeNumber: e.episodeNumber || 0,
      title: e.title,
    }))
  }, [show, mostRecentSeasonNumber])

  const openScheduleModal = () => {
    if (!show) return
    setSchedDate(
      show.tentativeNextAirDate
        ? show.tentativeNextAirDate.substring(0, 10)
        : '',
    )
    const baseline = show.tentativeNextEpisode
    setSchedTarget(
      baseline ? `s${baseline.seasonNumber}-e${baseline.episodeNumber}` : '',
    )
    setSchedFreq(show.tentativeFrequencyDays || 7)
    setScheduleOpen(true)
  }

  const saveSchedule = () => {
    if (!show) return
    if (!schedDate || !schedTarget) {
      setScheduleOpen(false)
      return
    }
    const [sStr, eStr] = schedTarget.split('-')
    const seasonNumber = Number((sStr || '').replace('s', ''))
    const episodeNumber = Number((eStr || '').replace('e', ''))
    const updated: Show = {
      ...show,
      tentativeNextAirDate: new Date(schedDate).toISOString(),
      tentativeNextEpisode: { seasonNumber, episodeNumber },
      tentativeFrequencyDays: Math.max(
        1,
        Number.isFinite(schedFreq) ? schedFreq : 7,
      ),
    }
    updateShow(updated)
    setScheduleOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="text-primary hover:underline"
        onClick={openScheduleModal}
      >
        Set tentative schedule
      </button>
      <DialogShell
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Set tentative schedule"
      >
        {!show || (show.seasons || []).length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Load seasons first to select an episode.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="sched-date"
                className="mb-1 block text-sm font-medium"
              >
                Date
              </label>
              <input
                id="sched-date"
                type="date"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label
                htmlFor="sched-episode"
                className="mb-1 block text-sm font-medium"
              >
                Episode
              </label>
              <select
                id="sched-episode"
                value={schedTarget}
                onChange={(e) => setSchedTarget(e.target.value)}
                className={fieldClass}
              >
                <option value="">Select episode</option>
                {allEpisodesFlat.map((ep) => (
                  <option
                    key={`s${ep.seasonNumber}-e${ep.episodeNumber}`}
                    value={`s${ep.seasonNumber}-e${ep.episodeNumber}`}
                  >
                    Season {ep.seasonNumber} · E{ep.episodeNumber} · {ep.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="sched-freq"
                className="mb-1 block text-sm font-medium"
              >
                Frequency (days)
              </label>
              <input
                id="sched-freq"
                type="number"
                min={1}
                value={schedFreq}
                onChange={(e) => setSchedFreq(Number(e.target.value) || 7)}
                className={fieldClass}
              />
            </div>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setScheduleOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={saveSchedule}
            disabled={!schedDate || !schedTarget}
          >
            Save
          </Button>
        </div>
      </DialogShell>
    </>
  )
}
