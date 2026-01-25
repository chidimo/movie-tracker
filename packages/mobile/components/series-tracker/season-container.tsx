import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Season, Show } from "@/lib/types";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { EpisodeCard } from "./episode-card";
import { CustomSwitch } from "../form-elements/custom-switch";
import { SeasonProgress } from "./show-info-components/series-progress";

export const SeasonContainer = ({
  season,
  show,
  hideWatched,
}: {
  season: Season;
  show: Show;
  hideWatched: boolean;
}) => {
  const { updateShow } = useSeriesTracker();
  const { border: borderColor, mutedText: mutedTextColor } = useThemeColor({}, [
    "border",
    "mutedText",
  ]);

  const episodes = useMemo(() => {
    const list = season.episodes || [];
    return hideWatched ? list.filter((e) => !e.watched) : list;
  }, [season.episodes, hideWatched]);

  const allWatched = episodes.every((e) => e.watched);
  const handleToggleAllWatched = (checked: boolean) => {
    if (!show) {
      return;
    }
    if (!season.seasonNumber) {
      return;
    }
    const nextSeasons = (show.seasons || []).map((s) => {
      if (s.seasonNumber !== season.seasonNumber) {
        return s;
      }
      return {
        ...s,
        episodes: (s.episodes || []).map((e) => ({
          ...e,
          watched: checked,
        })),
      };
    });
    updateShow({ ...show, seasons: nextSeasons });
  };

  return (
    <ThemedView style={[styles.container, { borderColor }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <View style={{}}>
          <ThemedText style={styles.title}>
            {season.title || `Season ${season.seasonNumber ?? ""}`}
          </ThemedText>
          <SeasonProgress season={season} />
        </View>
        <CustomSwitch
          value={allWatched}
          onChange={(checked) => handleToggleAllWatched(checked)}
        />
      </View>
      {episodes.length === 0 ? (
        <ThemedText style={[styles.empty, { color: mutedTextColor }]}>
          {allWatched ? "All watched" : "No episodes"}
        </ThemedText>
      ) : (
        <View style={styles.episodeList}>
          {episodes.map((e, idx) => (
            <EpisodeCard
              key={(e.episodeNumber ?? idx).toString()}
              episode={e}
              show={show}
              season={season}
            />
          ))}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  title: {
    fontWeight: "600",
    marginBottom: 8,
  },
  empty: {
    opacity: 0.8,
  },
  episodeList: {
    gap: 6,
  },
  epRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  epNum: {
    width: 28,
    fontWeight: "600",
  },
  epTitle: {
    flex: 1,
  },
  epDate: {
    opacity: 0.8,
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginVertical: 4,
  },
});
