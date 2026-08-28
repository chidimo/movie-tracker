import { StyleSheet, View } from 'react-native'
import { ThemedText } from '../../themed-text'
import { ThemedView } from '../../themed-view'
import type { ProgressProps } from '@/hooks/use-progress'
import { useProgress } from '@/hooks/use-progress'

type BaseProps = {
  className?: string
}

type SeriesComponentProps = BaseProps & ProgressProps

export const SeriesProgress = ({
  seriesId,
  season,
  label,
  className,
  showFraction,
  showPercentage,
}: SeriesComponentProps) => {
  const progress = useProgress(
    season
      ? { season, label, showFraction, showPercentage }
      : { seriesId, label, showFraction, showPercentage },
  )

  return (
    <ThemedView className={className} style={{}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {progress.label ? (
          <ThemedText className="font-medium" style={styles.text}>
            {progress.label}:{' '}
          </ThemedText>
        ) : null}
        {progress.showFraction ? (
          <ThemedText style={styles.text}>
            {progress.watched}/{progress.total}
          </ThemedText>
        ) : null}
        {progress.showFraction && progress.showPercentage ? (
          <ThemedText> · </ThemedText>
        ) : null}
        {progress.showPercentage ? (
          <ThemedText style={styles.text}>{progress.percentage}%</ThemedText>
        ) : null}
      </View>
      <View
        style={{
          backgroundColor: '#e5e7eb',
          height: 8,
          borderRadius: 4,
          width: '100%',
        }}
      >
        <View
          style={{
            width: `${progress.percentage}%`,
            backgroundColor: '#00a63e',
            height: 8,
            borderRadius: 4,
          }}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: '#4a5565',
  },
})
