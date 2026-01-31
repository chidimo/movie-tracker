import { Image, StyleSheet } from 'react-native'
import { HorizontalSeparator } from '../horizontal-separator'
import { ExploreAI } from './explore-ai'
import { PersonalizedRecommendations } from './personalized-recommendations'
import { TrendingShows } from './trending-shows'
import { EnhancedDiscovery } from './enhanced-discovery'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors, Fonts } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

export const ExploreScreen = () => {
  const { border: borderColor } = useThemeColor({}, ['border'])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.surface,
        dark: Colors.dark.surfaceAlt,
      }}
      headerImage={
        <Image
          source={require('@/assets/images/popcorn-time.png')}
          style={[styles.reactLogo, { borderColor }]}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explore series
        </ThemedText>
      </ThemedView>

      <PersonalizedRecommendations />
      <HorizontalSeparator />
      <ExploreAI />
      <HorizontalSeparator />
      <TrendingShows />
      <HorizontalSeparator />
      <EnhancedDiscovery />
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
    borderBottomWidth: 1,
  },
})
