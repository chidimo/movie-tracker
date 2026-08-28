import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { Pressable, StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useSeriesTracker } from '@/context/series-tracker-context'

type Props = {
  showId: string
}

export const OpenIMDbButton = ({ showId }: Props) => {
  const { tint: tintColor } = useThemeColor({}, ['tint'])
  const { getShowById } = useSeriesTracker()
  const show = getShowById(showId)

  const handleOpenIMDb = async () => {
    if (show?.imdbUrl) {
      await WebBrowser.openBrowserAsync(show.imdbUrl)
    }
  }

  return (
    <Pressable style={styles.button} onPress={handleOpenIMDb}>
      <Ionicons name="link" size={20} color={tintColor} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 4,
  },
})
