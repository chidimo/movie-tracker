import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { StyleSheet } from "react-native";
import { SeriesDetailView } from "./series-detail-view";

export const SeriesDetailPage = ({ imdbId }: { imdbId: string }) => {
  const { getShowById } = useSeriesTracker();
  const show = getShowById(imdbId);

  if (!show) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Show not found in your list.</ThemedText>
      </ThemedView>
    );
  }

  return <SeriesDetailView show={show} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    marginBottom: 16,
  },
});
