import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { Link, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { CustomButton } from "../form-elements/custom-button";
import ParallaxScrollView from "../parallax-scroll-view";
import { Welcome } from "../welcome";
import { ShowCard } from "./show-card";
import { CommonArtists } from "./show-info-components/common-artists";

export const SeriesTrackerPage = () => {
  const { getOrderedShows } = useSeriesTracker();
  const router = useRouter();
  const orderedShows = getOrderedShows();

  return (
    <ParallaxScrollView>
      <Welcome />

      <View style={styles.findRow}>
        <Link href="/search">
          <Link.Trigger>
            <ThemedText type="link">Find more shows</ThemedText>
          </Link.Trigger>
        </Link>
      </View>

      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ThemedText type="subtitle">Your shows</ThemedText>
        <ThemedView style={{ flexDirection: "row", gap: 8 }}>
          <CustomButton
            title="Import"
            variant="CANCEL"
            containerStyle={{
              width: "auto",
              paddingHorizontal: 8,
              borderRadius: 4,
            }}
            onPress={() => router.push("/import")}
          />
          <CustomButton
            title="Export"
            variant="CANCEL"
            containerStyle={{
              width: "auto",
              paddingHorizontal: 8,
              borderRadius: 4,
            }}
            onPress={() => router.push("/export")}
          />
        </ThemedView>
      </ThemedView>

      {orderedShows.length === 0 ? (
        <ThemedText>No shows yet. Use Find Shows to add one.</ThemedText>
      ) : (
        <>
          <CommonArtists />
          {orderedShows.map((show) => {
            return <ShowCard key={show.imdbId} show={show} />;
          })}
        </>
      )}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  findRow: {
    marginTop: 4,
    marginBottom: 8,
  },
});
