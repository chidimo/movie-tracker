import { aiDiscovery } from '@movie-tracker/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { PressablePill } from '../pressable-pill'
import type { AIRecommendation, OmdbSearchItem } from '@movie-tracker/core'
import { CustomButton } from '@/components/form-elements/custom-button'
import { SearchResult } from '@/components/series-tracker/search-result'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { useOmdbTitleMutation } from '@/hooks/use-movies-legacy'
import { useThemeColor } from '@/hooks/use-theme-color'

export const PersonalizedRecommendations = () => {
  const { state, addShow } = useSeriesTracker()
  const { mutedText: mutedTextColor, surface: surfaceColor } = useThemeColor(
    {},
    ['mutedText', 'surface'],
  )

  const [selectedMood, setSelectedMood] = useState<string>('')

  const { mutateAsync: fetchTitle, isPending } = useOmdbTitleMutation()

  // Get personalized recommendations based on user's shows
  const {
    data: recommendations,
    isFetching: isLoadingRecommendations,
    refetch: refetchRecommendations,
  } = useQuery({
    queryKey: ['personalized-recommendations', state.shows.length],
    queryFn: () => aiDiscovery.getPersonalizedRecommendations(state.shows),
    enabled: state.shows.length > 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  // Get mood-based recommendations
  const {
    data: moodRecommendations,
    isPending: isLoadingMood,
    mutate: getMoodRecommendations,
  } = useMutation({
    mutationFn: (mood: string) => aiDiscovery.getMoodBasedRecommendations(mood),
  })

  const moods = [
    { emoji: '😊', label: 'Feel-good', value: 'feel-good comedy' },
    { emoji: '🧠', label: 'Mind-bending', value: 'mind-bending thriller' },
    { emoji: '❤️', label: 'Romantic', value: 'romantic drama' },
    { emoji: '😂', label: 'Laugh', value: 'hilarious comedy' },
    { emoji: '🔥', label: 'Intense', value: 'intense action drama' },
    { emoji: '🌙', label: 'Relaxing', value: 'relaxing slice of life' },
  ]

  const onAdd = async (item: OmdbSearchItem) => {
    const show = await fetchTitle(item.imdbID)
    if (!show) return
    await addShow(show)
  }

  const onMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    getMoodRecommendations(mood)
  }

  const renderRecommendationCard = (recommendation: AIRecommendation) => {
    const isAdded = state.shows.some(
      (s) => s.imdbId === recommendation.show.imdbID,
    )

    return (
      <SearchResult
        key={`personalized-${recommendation.show.imdbID}`}
        item={recommendation.show}
        onAdd={onAdd}
        isAdded={isAdded}
        isLoading={isPending}
      />
    )
  }

  return (
    <ThemedView style={styles.section}>
      <View style={styles.header}>
        <ThemedText type="subtitle">For You</ThemedText>
        {state.shows.length > 1 && (
          <CustomButton
            title="Refresh"
            variant="SECONDARY"
            onPress={() => refetchRecommendations()}
            containerStyle={styles.refreshButton}
          />
        )}
      </View>

      {state.shows.length === 0 ? (
        <ThemedView
          style={[styles.emptyState, { backgroundColor: surfaceColor }]}
        >
          <ThemedText style={styles.emptyText}>
            Add some shows to your library to get personalized recommendations!
          </ThemedText>
        </ThemedView>
      ) : (
        <>
          <ThemedText style={{ color: mutedTextColor }}>
            Based on your taste in {state.shows.length} shows
          </ThemedText>

          {isLoadingRecommendations ? (
            <ThemedText style={{ color: mutedTextColor }}>
              Analyzing your preferences…
            </ThemedText>
          ) : (
            recommendations?.map(renderRecommendationCard)
          )}

          {/* Mood-based recommendations */}
          <ThemedText type="default" style={styles.moodTitle}>
            In the mood for…
          </ThemedText>

          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <PressablePill
                key={mood.value}
                text={mood.label}
                emoji={mood.emoji}
                selected={selectedMood === mood.value}
                onPress={() => onMoodSelect(mood.value)}
              />
            ))}
          </View>

          {isLoadingMood && (
            <ThemedText style={{ color: mutedTextColor }}>
              Finding {selectedMood} shows…
            </ThemedText>
          )}

          {moodRecommendations?.map((rec) => (
            <View
              key={`mood-${rec.show.imdbID}`}
              style={styles.moodRecommendation}
            >
              <ThemedText style={styles.moodReason}>💡 {rec.reason}</ThemedText>
              {renderRecommendationCard(rec)}
            </View>
          ))}
        </>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 'auto',
  },
  emptyState: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
  },
  moodTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectedMood: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  moodRecommendation: {
    marginTop: 8,
  },
  moodReason: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 4,
    opacity: 0.8,
  },
})
