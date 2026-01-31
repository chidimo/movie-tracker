import { StyleSheet, View } from 'react-native'
import { CustomSwitch } from '../form-elements/custom-switch'
import type { Episode, Season, Show } from '@movie-tracker/core'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { useThemeColor } from '@/hooks/use-theme-color'

export const EpisodeCard = ({
  show,
  season,
  episode,
}: {
  show: Show
  season: Season
  episode: Episode
}) => {
  const { updateShow } = useSeriesTracker()
  const { border: borderColor, mutedText: mutedTextColor } = useThemeColor({}, [
    'border',
    'mutedText',
  ])

  const toggleEpisode = (
    seasonNumber: number,
    episodeNumber?: number,
    watched?: boolean,
  ) => {
    if (!show) return
    if (!episodeNumber) return
    const nextSeasons = (show.seasons || []).map((s) => {
      if (s.seasonNumber !== seasonNumber) {
        return s
      }
      return {
        ...s,
        episodes: (s.episodes || []).map((e) =>
          e.episodeNumber === episodeNumber
            ? { ...e, watched: watched ?? !e.watched }
            : e,
        ),
      }
    })
    updateShow({ ...show, seasons: nextSeasons })
  }

  const watched = !!episode.watched

  return (
    <ThemedView style={[styles.cardRow, { borderBottomColor: borderColor }]}>
      <View style={styles.infoCol}>
        <ThemedText style={styles.title}>
          {episode.episodeNumber ? `E${episode.episodeNumber} · ` : ''}
          {episode.title}
        </ThemedText>
        {episode.releaseDate ? (
          <ThemedText style={[styles.subtle, { color: mutedTextColor }]}>
            Air date: {new Date(episode.releaseDate).toLocaleDateString()}
          </ThemedText>
        ) : null}
      </View>
      <CustomSwitch
        label={watched ? 'Watched' : 'Not watched'}
        value={watched}
        onChange={(val) =>
          toggleEpisode(season.seasonNumber ?? 0, episode.episodeNumber, val)
        }
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  cardRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoCol: {
    flex: 1,
  },
  switchCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: '600',
  },
  subtle: {
    opacity: 0.8,
    fontSize: 12,
  },
})
