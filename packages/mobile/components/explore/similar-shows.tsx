import { filterSearchResults } from '@movie-tracker/core'
import { StyleSheet, View } from 'react-native'
import type { OmdbSearchItem } from '@/components/series-tracker/search-result'
import { SearchResult } from '@/components/series-tracker/search-result'
import { ThemedText } from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'

interface AIRecommendation {
  show: OmdbSearchItem
  reason: string
  confidence: number
  category: 'similar' | 'trending' | 'hidden_gem' | 'mood_based'
}

interface SimilarShowsProps {
  selectedInsight: string
  similarShows: Array<AIRecommendation> | undefined
  isLoadingSimilar: boolean
  onAdd: (item: OmdbSearchItem) => void
  isPending: boolean
  isAdded: (imdbId: string) => boolean
  userShows: Array<{ imdbId: string }>
}

export const SimilarShows = ({
  selectedInsight,
  similarShows,
  isLoadingSimilar,
  onAdd,
  isPending,
  isAdded,
  userShows,
}: SimilarShowsProps) => {
  const { mutedText: mutedTextColor } = useThemeColor({}, ['mutedText'])

  if (!selectedInsight) return null

  // Filter out duplicates and existing shows
  const filteredShows = similarShows
    ? (filterSearchResults(
        similarShows.map((rec) => rec.show),
        userShows,
      )
        .map((show) =>
          similarShows.find((rec) => rec.show.imdbID === show.imdbID),
        )
        .filter(Boolean) as Array<AIRecommendation>)
    : []

  return (
    <View style={styles.similarSection}>
      <ThemedText type="default" style={styles.similarTitle}>
        Shows like &ldquo;{selectedInsight}&rdquo;
      </ThemedText>

      {isLoadingSimilar ? (
        <ThemedText style={{ color: mutedTextColor }}>
          Finding similar shows…
        </ThemedText>
      ) : (
        filteredShows.map((rec) => (
          <View key={`similar-${rec.show.imdbID}`} style={styles.similarCard}>
            <ThemedText style={styles.similarReason}>
              💡 {rec.reason}
            </ThemedText>
            <SearchResult
              item={rec.show}
              onAdd={onAdd}
              isAdded={isAdded(rec.show.imdbID)}
              isLoading={isPending}
            />
          </View>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  similarSection: {
    marginTop: 16,
    gap: 8,
  },
  similarTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  similarCard: {
    gap: 4,
  },
  similarReason: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
})
