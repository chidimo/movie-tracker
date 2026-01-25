import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { StyleSheet, View } from 'react-native'

export const AIDebugInfo = () => {
  const config = {
    baseUrl: process.env.EXPO_PUBLIC_AI_BASE_URL || 'Not set',
    model: process.env.EXPO_PUBLIC_AI_MODEL || 'Not set',
    hasGroqKey: !!process.env.EXPO_PUBLIC_GROQ_API_KEY,
    debugMode: process.env.EXPO_PUBLIC_DEBUG_AI === 'true',
    recommendationCount:
      process.env.EXPO_PUBLIC_AI_RECOMMENDATION_COUNT || 'Not set',
  }

  const configs = [
    {
      label: 'Base URL',
      value: config.baseUrl,
    },
    {
      label: 'Model',
      value: config.model,
    },
    {
      label: 'Has Groq Key',
      value: config.hasGroqKey ? 'Yes' : 'No',
    },
    {
      label: 'Debug Mode',
      value: config.debugMode ? 'Enabled' : 'Disabled',
    },
    {
      label: 'Recommendation Count',
      value: config.recommendationCount,
    },
  ]

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">AI Debug Info</ThemedText>

      {configs.map((config, index) => (
        <View key={index}>
          <ThemedText style={styles.label}>{config.label}:</ThemedText>
          <ThemedText style={styles.value}>{config.value}</ThemedText>
        </View>
      ))}

      <ThemedText style={styles.note}>
        Add EXPO_PUBLIC_DEBUG_AI=&quot;true&quot; to your .env file to enable AI
        logging in production
      </ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    gap: 8,
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    flex: 2,
  },
  note: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    fontStyle: 'italic',
  },
})
