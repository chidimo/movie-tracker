import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SeriesPreviewPage } from "@/components/series-tracker/series-preview-page";

export default function PreviewShowScreen() {
  const params = useLocalSearchParams<{ imdbId?: string }>();
  const imdbId = typeof params.imdbId === "string" ? params.imdbId : undefined;

  if (!imdbId) {
    return (
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText>Missing show id</ThemedText>
      </ThemedView>
    );
  }

  return <SeriesPreviewPage imdbId={imdbId} />;
}
