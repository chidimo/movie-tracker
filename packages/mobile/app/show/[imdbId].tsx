import { useLocalSearchParams } from "expo-router";
import { SeriesDetailPage } from "@/components/series-tracker/series-detail-page";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ShowDetailScreen() {
  const params = useLocalSearchParams<{ imdbId?: string }>();
  const imdbId = typeof params.imdbId === "string" ? params.imdbId : undefined;

  if (!imdbId) {
    return (
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText>Missing show id</ThemedText>
      </ThemedView>
    );
  }

  return <SeriesDetailPage imdbId={imdbId} />;
}
