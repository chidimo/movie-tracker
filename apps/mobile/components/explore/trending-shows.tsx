import { aiDiscovery } from '@movie-tracker/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import type { AIRecommendation } from '@movie-tracker/core'
import type { OmdbSearchItem } from '@/components/series-tracker/search-result'
import { CustomButton } from '@/components/form-elements/custom-button'
import { SearchResult } from '@/components/series-tracker/search-result'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSeriesTracker } from '@/context/series-tracker-context'
import { useOmdbTitleMutation } from '@/hooks/use-movies-legacy'
import { useThemeColor } from '@/hooks/use-theme-color'

export const TrendingShows = () => {
  const { state, addShow } = useSeriesTracker()
  const { mutedText: mutedTextColor, surface: surfaceColor } = useThemeColor(
    {},
    ['mutedText', 'surface'],
  )

  const [selectedCategory, setSelectedCategory] = useState<string>('trending')

  const { mutateAsync: fetchTitle, isPending } = useOmdbTitleMutation()

  // Get trending shows
  const {
    data: trendingShows,
    isFetching: isLoadingTrending,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ['trending-shows'],
    queryFn: () => aiDiscovery.getTrendingShows(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  // Get hidden gems
  const {
    data: hiddenGems,
    isPending: isLoadingGems,
    mutate: getHiddenGems,
  } = useMutation({
    mutationFn: () =>
      aiDiscovery.getMoodBasedRecommendations('underrated hidden gems'),
  })

  // Get critics' choice
  const {
    data: criticsChoice,
    isPending: isLoadingCritics,
    mutate: getCriticsChoice,
  } = useMutation({
    mutationFn: () =>
      aiDiscovery.getMoodBasedRecommendations(
        'critically acclaimed award-winning',
      ),
  })

  const categories = [
    { id: 'trending', label: "What's Hot", icon: '🔥' },
    { id: 'gems', label: 'Hidden Gems', icon: '💎' },
    { id: 'critics', label: "Critics' Choice", icon: '⭐' },
  ]

  const onAdd = async (item: OmdbSearchItem) => {
    const show = await fetchTitle(item.imdbID)
    if (!show) return
    await addShow(show)
  }

  const onCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)

    if (categoryId === 'gems') {
      getHiddenGems()
    } else if (categoryId === 'critics') {
      getCriticsChoice()
    }
  }

  const renderRecommendationCard = (recommendation: AIRecommendation) => {
    const isAdded = state.shows.some(
      (s) => s.imdbId === recommendation.show.imdbID,
    )

    return (
      <View
        key={`trending-${recommendation.show.imdbID}`}
        style={styles.recommendationCard}
      >
        <ThemedText style={styles.reason}>{recommendation.reason}</ThemedText>
        <SearchResult
          item={recommendation.show}
          onAdd={onAdd}
          isAdded={isAdded}
          isLoading={isPending}
        />
      </View>
    )
  }

  const getCurrentShows = () => {
    switch (selectedCategory) {
      case 'gems':
        return hiddenGems
      case 'critics':
        return criticsChoice
      default:
        return trendingShows
    }
  }

  const getCurrentLoading = () => {
    switch (selectedCategory) {
      case 'gems':
        return isLoadingGems
      case 'critics':
        return isLoadingCritics
      default:
        return isLoadingTrending
    }
  }

  const currentShows = getCurrentShows()
  const currentLoading = getCurrentLoading()

  return (
    <ThemedView style={styles.section}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Discover</ThemedText>
        <CustomButton
          title="Refresh"
          variant="SECONDARY"
          onPress={() => {
            if (selectedCategory === 'trending') {
              refetchTrending()
            } else {
              onCategorySelect(selectedCategory)
            }
          }}
          containerStyle={styles.refreshButton}
        />
      </View>

      {/* Category selector */}
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => onCategorySelect(category.id)}
            style={[
              styles.categoryPill,
              { backgroundColor: surfaceColor },
              selectedCategory === category.id && styles.selectedCategory,
            ]}
          >
            <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
            <ThemedText style={styles.categoryLabel}>
              {category.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText style={{ color: mutedTextColor }}>
        {selectedCategory === 'trending' && 'Currently popular series'}
        {selectedCategory === 'gems' &&
          'Underrated masterpieces you might have missed'}
        {selectedCategory === 'critics' &&
          'Award-winning and critically acclaimed shows'}
      </ThemedText>

      {currentLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={{ color: mutedTextColor }}>
            {selectedCategory === 'trending' && "Finding what's trending…"}
            {selectedCategory === 'gems' && 'Discovering hidden gems…'}
            {selectedCategory === 'critics' && "Loading critics' picks…"}
          </ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.showsContainer}>
          {currentShows?.map(renderRecommendationCard)}
        </View>
      )}

      {/* Quick stats */}
      <View style={[styles.statsContainer, { backgroundColor: surfaceColor }]}>
        <ThemedText style={styles.statsTitle}>📊 This Week</ThemedText>
        <View style={styles.statsRow}>
          <ThemedText style={styles.statItem}>
            🎬 {state.shows.length} in your library
          </ThemedText>
          <ThemedText style={styles.statItem}>
            🔥 {trendingShows?.length || 0} trending
          </ThemedText>
        </View>
      </View>
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
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 2,
    flex: 1,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  showsContainer: {
    gap: 8,
  },
  recommendationCard: {
    gap: 4,
  },
  reason: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
    marginBottom: 4,
  },
  statsContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    fontSize: 12,
    opacity: 0.8,
  },
})
