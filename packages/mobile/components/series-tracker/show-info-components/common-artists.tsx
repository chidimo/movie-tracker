import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ArtistFrequency, getCommonArtists } from "@movie-tracker/core";
import { ScrollView, StyleSheet, View } from "react-native";

const ArtistItem = ({ artist }: { artist: ArtistFrequency }) => {
  const { mutedText: mutedTextColor } = useThemeColor({}, ["mutedText"]);

  return (
    <View style={styles.artistItem}>
      <ThemedText style={styles.artistName}>{artist.name}</ThemedText>
      <ThemedText style={[styles.frequency, { color: mutedTextColor }]}>
        {artist.frequency} show{artist.frequency !== 1 ? "s" : ""}
      </ThemedText>
      <ThemedText style={[styles.showsList, { color: mutedTextColor }]}>
        Appears in: {artist.shows.slice(0, 3).join(", ")}
        {artist.shows.length > 3 && ` +${artist.shows.length - 3} more`}
      </ThemedText>
    </View>
  );
};

export const CommonArtists = () => {
  const { state } = useSeriesTracker();
  const { border: borderColor } = useThemeColor({}, ["border"]);

  const commonArtists = getCommonArtists(state.shows);

  if (commonArtists.length === 0) {
    return (
      <ThemedView style={[styles.container, { borderColor }]}>
        <ThemedText style={styles.title}>Common Artists</ThemedText>
        <ThemedText style={styles.noData}>
          No cast information available. Add shows with cast data to see common
          artists.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { borderColor }]}>
      <ThemedText style={styles.title}>Common Artists</ThemedText>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {commonArtists.map((artist, index) => (
          <ArtistItem key={`${artist.name}-${index}`} artist={artist} />
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  noData: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: "italic",
  },
  scrollContainer: {
    maxHeight: 300,
  },
  artistItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  artistName: {
    fontSize: 16,
    fontWeight: "500",
  },
  frequency: {
    fontSize: 12,
    marginTop: 2,
  },
  showsList: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
});
