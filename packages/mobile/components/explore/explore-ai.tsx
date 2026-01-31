import { filterSearchResults } from '@movie-tracker/core'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import type { OmdbSearchItem } from '@/components/series-tracker/search-result'
import { CustomButton } from '@/components/form-elements/custom-button'
import { CustomInput } from '@/components/form-elements/custom-input'
import { SearchResult } from '@/components/series-tracker/search-result'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useSeriesTracker } from '@/context/series-tracker-context'
import {
  useOmdbTitleMutation,
  useSearchSeries,
} from '@/hooks/use-movies-legacy'
import { useThemeColor } from '@/hooks/use-theme-color'
import { getAssistantQuery } from '@/lib/assistant'

export const ExploreAI = () => {
  const { state, addShow } = useSeriesTracker()
  const { mutedText: mutedTextColor } = useThemeColor({}, ['mutedText'])

  const [assistantInput, setAssistantInput] = useState('')
  const [assistantQuery, setAssistantQuery] = useState('')
  const {
    data: assistantResults,
    isFetching: isAssistantLoading,
    isError: isAssistantError,
    error: assistantError,
  } = useSearchSeries(assistantQuery, {
    enabled: !!assistantQuery,
  })

  const { mutateAsync: fetchTitle, isPending } = useOmdbTitleMutation()
  const { mutateAsync: askAssistant, isPending: assistantThinking } =
    useMutation({
      mutationFn: (prompt: string) => getAssistantQuery(prompt),
    })

  const sanitizePrompt = (text: string) => {
    const stopwords = new Set([
      'a',
      'an',
      'the',
      'and',
      'or',
      'about',
      'show',
      'series',
      'with',
      'like',
      'find',
      'suggest',
      'me',
    ])
    const words = text
      .toLowerCase()
      .replaceAll(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w && !stopwords.has(w))
    return words.slice(0, 3).join(' ')
  }

  const onAssistantSubmit = async () => {
    const prompt = assistantInput.trim().slice(0, 200)
    if (!prompt) return

    const assistantResult = await askAssistant(prompt)
    const normalized = (assistantResult || sanitizePrompt(prompt)).trim()
    setAssistantQuery(normalized || 'popular series')
  }

  const onAdd = async (item: OmdbSearchItem) => {
    const show = await fetchTitle(item.imdbID)
    if (!show) return
    await addShow(show)
  }

  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">AI assistant</ThemedText>
      <ThemedText style={{ color: mutedTextColor }}>
        This assistant uses a safe prompt-to-query step and then searches OMDB.
        If no assistant is configured, it falls back to keyword matching.
      </ThemedText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <CustomInput
          value={assistantInput}
          onChangeText={setAssistantInput}
          placeholder="Try: dark sci-fi with mystery"
          returnKeyType="search"
          onSubmitEditing={onAssistantSubmit}
          containerStyle={{ width: '74%' }}
        />
        <CustomButton
          title="Suggest"
          variant="SECONDARY"
          onPress={onAssistantSubmit}
          containerStyle={{
            width: '24%',
            paddingHorizontal: 8,
            borderRadius: 4,
          }}
        />
      </View>
      {assistantQuery ? (
        <ThemedText style={{ color: mutedTextColor }}>
          Suggested search: {assistantQuery}
        </ThemedText>
      ) : null}
      {assistantThinking || isAssistantLoading ? (
        <ThemedText style={{ color: mutedTextColor }}>
          Finding suggestions…
        </ThemedText>
      ) : null}
      {isAssistantError ? (
        <ThemedText style={{ color: mutedTextColor }}>
          {assistantError instanceof Error
            ? assistantError.message
            : 'Assistant search failed'}
        </ThemedText>
      ) : null}
      {filterSearchResults(assistantResults || [], state.shows).map((item) => {
        const isAdded = state.shows.some((s) => s.imdbId === item.imdbID)
        return (
          <SearchResult
            key={`assistant-${item.imdbID}`}
            item={item}
            onAdd={onAdd}
            isAdded={isAdded}
            isLoading={isPending}
          />
        )
      })}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
})
