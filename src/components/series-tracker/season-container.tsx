import type { Season, Show } from '@/lib/series-tracker/types'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { EpisodeCard } from './episode-card'
import { Switcher } from '../switcher'
import { SeasonProgress } from './show-info-components'

export const SeasonContainer = ({
  show,
  season,
  hideWatched,
}: {
  show: Show
  season: Season
  hideWatched: boolean
}) => {
  const { updateShow } = useSeriesTracker()

  const toggleSeason = (seasonNumber: number, watched: boolean) => {
    if (!show) return
    const nextSeasons = (show.seasons || []).map((s) => {
      if (s.seasonNumber !== seasonNumber) return s
      return {
        ...s,
        episodes: (s.episodes || []).map((e) => ({ ...e, watched })),
      }
    })
    updateShow({ ...show, seasons: nextSeasons })
  }

  const seasonWatched = season.episodes.every((e) => e.watched)

  return (
    <div key={season.seasonNumber ?? season.title} className="border rounded">
      <div className="flex items-center justify-between mb-2 p-3">
        <div>
          <h2 className="font-semibold">{season.title}</h2>

          <SeasonProgress
            season={season}
            className="mt-2"
            label="Progress"
            showFraction
            showPercentage
          />
        </div>
        <Switcher
          label={
            seasonWatched ? 'Mark season unwatched' : 'Mark season watched'
          }
          checked={seasonWatched}
          onChange={(checked) => {
            toggleSeason(season.seasonNumber ?? 0, checked)
          }}
        />
      </div>
      <ul className="divide-y">
        {season.episodes
          .filter((e) => (hideWatched ? !e.watched : true))
          .map((e) => (
            <EpisodeCard
              key={e.episodeNumber ?? e.title}
              episode={e}
              season={season}
              show={show}
            />
          ))}
      </ul>
    </div>
  )
}
