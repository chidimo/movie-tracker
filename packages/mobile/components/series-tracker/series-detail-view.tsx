import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useFetchSeasons } from "@/hooks/use-fetch-seasons";
import { useImageWithFallback } from "@/hooks/use-image-with-fallback";
import { useThemeColor } from "@/hooks/use-theme-color";
import { IMDB_BASE_URL, Show } from "@movie-tracker/core";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { Pressable, StyleSheet, View } from "react-native";
import { CustomSwitch } from "../form-elements/custom-switch";
import ParallaxScrollView from "../parallax-scroll-view";
import { ScheduleSetter } from "./schedule-setter";
import { SeasonContainer } from "./season-container";
import {
  CastDisplay,
  RatingsDisplay,
  SeriesProgress,
} from "./show-info-components";
import { useState } from "react";

export const SeriesDetailView = ({ show }: { show: Show }) => {
  const { getShowProgress, updateShow } = useSeriesTracker();

  const [hideWatched, setHideWatched] = useState(show?.hideWatched ?? true);
  const { mutedText: mutedTextColor } = useThemeColor({}, ["mutedText"]);

  const showProgress = getShowProgress(show.imdbId);
  const hasThumbnail = show?.thumbnail && show.thumbnail !== "N/A";

  const handleHideWatchedChange = (value: boolean) => {
    setHideWatched(value);
    if (show) {
      updateShow({ ...show, hideWatched: value });
    }
  };

  const {
    imageSource: headerImageSource,
    handleImageError: handleHeaderImageError,
  } = useImageWithFallback({
    imageUrl: hasThumbnail ? show.thumbnail : undefined,
    fallbackImage: require("@/assets/images/popcorn-time.png"),
  });

  const {
    imageSource: posterImageSource,
    handleImageError: handlePosterImageError,
  } = useImageWithFallback({
    imageUrl: hasThumbnail ? show.thumbnail : undefined,
    fallbackImage: require("@/assets/images/popcorn-time.png"),
  });

  const { fetchingSeasons } = useFetchSeasons(show.imdbId);

  const imdbVideosUrl = `${IMDB_BASE_URL}/${show.imdbId}/videogallery/`;

  return (
    <ParallaxScrollView
      headerHeight={600}
      headerImage={
        <Image
          source={headerImageSource}
          style={styles.reactLogo}
          onError={handleHeaderImageError}
        />
      }
    >
      {fetchingSeasons && <ThemedText>Fetching seasons...</ThemedText>}
      <ThemedView style={styles.container}>
        <View style={styles.headerRow}>
          <Image
            source={posterImageSource}
            style={styles.poster}
            onError={handlePosterImageError}
          />
          <View style={styles.headerInfo}>
            <ThemedText type="title">{show.title}</ThemedText>
            {!!show.releaseYear && (
              <ThemedText style={[styles.subtle, { color: mutedTextColor }]}>
                {show.releaseYear}
              </ThemedText>
            )}
            {!!show.plot && (
              <ThemedText style={styles.plot}>{show.plot}</ThemedText>
            )}

            <CastDisplay cast={show.mainCast} />
            <RatingsDisplay rating={show.rating} votes={show.votes} />
            <SeriesProgress seriesId={show.imdbId} label="Overall progress" />

            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => WebBrowser.openBrowserAsync(show.imdbUrl)}
              >
                <ThemedText type="link">Open on IMDb</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => WebBrowser.openBrowserAsync(imdbVideosUrl)}
              >
                <ThemedText type="link">Watch trailer</ThemedText>
              </Pressable>
              <ScheduleSetter show={show} />
            </View>
            <ThemedText style={styles.progress}>
              Overall progress: {showProgress?.watched || 0}/
              {showProgress?.total || 0}
            </ThemedText>
          </View>
        </View>

        <View style={styles.seasonsHeader}>
          <ThemedText type="subtitle">Seasons</ThemedText>
          <CustomSwitch
            label={hideWatched ? "Watched collapsed" : "Collapse watched"}
            value={hideWatched}
            onChange={handleHideWatchedChange}
          />
        </View>

        <View style={{ gap: 12 }}>
          {[...show.seasons]
            .sort((a, b) => (b.seasonNumber ?? 0) - (a.seasonNumber ?? 0))
            .map((s) => (
              <SeasonContainer
                key={s.seasonNumber ?? s.title}
                season={s}
                show={show}
                hideWatched={hideWatched}
              />
            ))}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    gap: 12,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  posterPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  subtle: {
    opacity: 0.8,
  },
  plot: {
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  progress: {
    marginTop: 8,
  },
  seasonsHeader: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
    borderBottomWidth: 1,
  },
});
