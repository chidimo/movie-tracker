import { SearchResult } from "@/components/series-tracker/search-result";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useOmdbTitleMutation, useSearchSeries } from "@/hooks/use-movies";
import { useThemeColor } from "@/hooks/use-theme-color";
import { aiDiscovery } from "@/lib/ai-discovery";
import { OmdbSearchItem } from "@/lib/omdb";
import { filterSearchResults } from "@/lib/search-utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PressablePill } from "../pressable-pill";
import { AIInsightsCard } from "./ai-insights-card";
import { DiscoverySearch } from "./discovery-search";
import { SimilarShows } from "./similar-shows";

export const EnhancedDiscovery = () => {
  const { state, addShow } = useSeriesTracker();
  const { mutedText: mutedTextColor } = useThemeColor({}, ["mutedText"]);

  const [discoveryQuery, setDiscoveryQuery] = useState("");
  const [selectedInsight, setSelectedInsight] = useState<string>("");
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  const { mutateAsync: fetchTitle, isPending } = useOmdbTitleMutation();

  // Enhanced search with AI insights
  const {
    data: searchResults,
    isFetching: isSearching,
    refetch: executeSearch,
  } = useSearchSeries(discoveryQuery, {
    enabled: false,
  });

  // AI-powered show insights and comparisons
  const {
    data: aiInsights,
    isPending: isLoadingInsights,
    mutate: generateInsights,
  } = useMutation({
    mutationFn: async (query: string) => {
      const prompt = `For the TV series "${query}", provide:
        1. A compelling 2-sentence description
        2. 3 key themes or elements
        3. Why viewers love it
        4. Perfect for viewers who like...
        5. Content complexity (Simple/Moderate/Complex)

        Format as JSON with fields: description, themes, whyLove, perfectFor, complexity`;

      const response = await aiDiscovery.callAI(prompt);
      try {
        const jsonMatch = new RegExp(/\{[\s\S]*\}/).exec(response);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        console.error("Failed to parse AI insights:", error);
      }

      // Fallback insights
      return {
        description: `An engaging series that captivates audiences with its unique storytelling.`,
        themes: ["drama", "character development", "storytelling"],
        whyLove: "Compelling characters and engaging plot",
        perfectFor: "Fans of quality television",
        complexity: "Moderate",
      };
    },
  });

  // "Shows like X" functionality
  const {
    data: similarShows,
    isPending: isLoadingSimilar,
    mutate: findSimilarShows,
  } = useMutation({
    mutationFn: async (showTitle: string) => {
      return aiDiscovery.getMoodBasedRecommendations(
        `shows similar to ${showTitle}`,
      );
    },
  });

  const discoveryPrompts = [
    {
      emoji: "🎭",
      label: "Character-driven",
      query: "character-driven drama series",
    },
    { emoji: "🧩", label: "Plot twists", query: "plot twist thriller series" },
    { emoji: "🔮", label: "Sci-fi", query: "science fiction series" },
    {
      emoji: "🌍",
      label: "International",
      query: "international foreign language series",
    },
    { emoji: "😂", label: "Smart comedy", query: "intelligent comedy series" },
    { emoji: "📚", label: "Book adaptation", query: "book adaptation series" },
  ];

  const onSearch = () => {
    if (!discoveryQuery.trim()) return;
    executeSearch();
    generateInsights(discoveryQuery);
  };

  const onPromptSelect = (prompt: string) => {
    setDiscoveryQuery(prompt);
    setTimeout(() => {
      executeSearch();
      generateInsights(prompt);
    }, 100);
  };

  const onAdd = async (item: OmdbSearchItem) => {
    const show = await fetchTitle(item.imdbID);
    if (!show) return;
    await addShow(show);
  };

  const onFindSimilar = (showTitle: string) => {
    setSelectedInsight(showTitle);
    findSimilarShows(showTitle);
  };

  const isAdded = (imdbId: string) => {
    return state.shows.some((s) => s.imdbId === imdbId);
  };

  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">Enhanced Discovery</ThemedText>

      {/* Search with AI insights */}
      <DiscoverySearch
        discoveryQuery={discoveryQuery}
        setDiscoveryQuery={setDiscoveryQuery}
        onSearch={onSearch}
      />

      <View style={styles.promptsContainer}>
        {discoveryPrompts.map((prompt) => (
          <PressablePill
            key={prompt.query}
            text={prompt.label}
            emoji={prompt.emoji}
            selected={selectedPrompt === prompt.query}
            onPress={() => {
              setSelectedPrompt(prompt.query);
              onPromptSelect(prompt.query);
            }}
          />
        ))}
      </View>

      {/* AI Insights Card */}
      <AIInsightsCard
        aiInsights={aiInsights}
        isLoadingInsights={isLoadingInsights}
        onFindSimilar={() => onFindSimilar(discoveryQuery)}
        discoveryQuery={discoveryQuery}
      />

      {/* Search Results */}
      {isSearching ? (
        <ThemedText style={{ color: mutedTextColor }}>
          Searching and analyzing…
        </ThemedText>
      ) : (
        filterSearchResults(searchResults || [], state.shows).map((item) => (
          <SearchResult
            key={`enhanced-${item.imdbID}`}
            item={item}
            onAdd={onAdd}
            isAdded={isAdded(item.imdbID)}
            isLoading={isPending}
          />
        ))
      )}

      {/* Similar Shows */}
      <SimilarShows
        selectedInsight={selectedInsight}
        similarShows={similarShows}
        isLoadingSimilar={isLoadingSimilar}
        onAdd={onAdd}
        isPending={isPending}
        isAdded={isAdded}
        userShows={state.shows}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  promptsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
});
