import { ActivityIndicator } from 'react-native'
import { SeriesDetailView } from './series-detail-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useGetShow } from '@/hooks/use-movies-legacy'

export const SeriesPreviewPage = ({ imdbId }: { imdbId: string }) => {
  const { data: show, isLoading, error } = useGetShow(imdbId)

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" />
        <ThemedText>Loading show details...</ThemedText>
      </ThemedView>
    )
  }

  if (error || !show) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <ThemedText>Failed to load show details</ThemedText>
        {error && (
          <ThemedText style={{ marginTop: 8, opacity: 0.7 }}>
            {error.message}
          </ThemedText>
        )}
      </ThemedView>
    )
  }

  return <SeriesDetailView show={show} />
}
