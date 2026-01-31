import { Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { ThemedText } from './themed-text'
import { IconSymbol } from './ui/icon-symbol'
import { ThemedView } from './themed-view'
import { useThemeColor } from '@/hooks/use-theme-color'

export const BackButton = () => {
  const router = useRouter()
  const { text: iconColor } = useThemeColor({}, ['text'])

  return (
    <Pressable onPress={() => router.back()}>
      <ThemedView
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        <IconSymbol size={20} name="gobackward" color={iconColor} />
        <ThemedText style={{ fontSize: 16 }}>Back</ThemedText>
      </ThemedView>
    </Pressable>
  )
}
