import { StyleSheet, View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'

type Props = {
  cast: any
}

export const CastDisplay = ({ cast }: Props) => {
  const { surface: chipBackground, text: chipTextColor } = useThemeColor({}, [
    'surface',
    'text',
  ])

  if (!Array.isArray(cast)) {
    return null
  }
  return (
    <View style={styles.castRow}>
      {cast.slice(0, 3).map((c: string) => {
        return (
          <ThemedText
            key={c}
            style={[
              styles.castChip,
              { backgroundColor: chipBackground, color: chipTextColor },
            ]}
          >
            {c}
          </ThemedText>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  castRow: {
    gap: 6,
    marginTop: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  castChip: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    lineHeight: 16,
    // Android-specific tweaks to prevent extra top/bottom spacing
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
})
