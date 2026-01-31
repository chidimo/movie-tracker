import { formatNumber } from '@movie-tracker/core'
import StarRating from 'react-native-star-rating-widget'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export const RatingsDisplay = ({
  rating,
  votes,
}: {
  rating?: number
  votes?: number
}) => {
  const {
    mutedText: mutedTextColor,
    tint: starColor,
    border: emptyStarColor,
  } = useThemeColor({}, ['mutedText', 'tint', 'border'])
  if (!rating) return null
  const stars = Math.max(0, Math.min(5, rating / 2))

  return (
    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <StarRating
        rating={stars}
        onChange={() => {}}
        starSize={16}
        color={starColor}
        emptyColor={emptyStarColor}
        starStyle={{ marginRight: 2 }}
      />
      {votes ? (
        <ThemedText style={{ color: mutedTextColor }}>
          /{formatNumber(votes)} votes
        </ThemedText>
      ) : null}
    </ThemedView>
  )
}
