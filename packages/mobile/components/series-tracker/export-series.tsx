import { useCallback, useMemo, useState } from "react";
import { Pressable, Share, StyleSheet, View } from "react-native";

import { Checkbox } from "@/components/form-elements/checkbox";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { normalizeShowTransfer } from "@/lib/compute-omdb";
import type { Show } from "@movie-tracker/core";
import ParallaxScrollView from "../parallax-scroll-view";
import { HorizontalSeparator } from "../horizontal-separator";
import { BackButton } from "../back-button";

export const ExportSeries = () => {
  const { state } = useSeriesTracker();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [includeEpisodes, setIncludeEpisodes] = useState(false);
  const {
    mutedText: mutedTextColor,
    tint: primaryColor,
    onTint: onPrimaryColor,
  } = useThemeColor({}, ["mutedText", "tint", "onTint"]);

  const allChecked = useMemo(
    () =>
      state.shows.length > 0 && state.shows.every((s) => selected[s.imdbId]),
    [state.shows, selected],
  );

  const toggleAll = useCallback(
    (val: boolean) => {
      const next: Record<string, boolean> = {};
      for (const s of state.shows) next[s.imdbId] = val;
      setSelected(next);
    },
    [state.shows],
  );

  const hasAny = useMemo(
    () => state.shows.some((s) => selected[s.imdbId]),
    [state.shows, selected],
  );

  const onShare = useCallback(async () => {
    const payload = {
      shows: state.shows
        .filter((s) => selected[s.imdbId])
        .map((s: Show) => normalizeShowTransfer(s, { includeEpisodes })),
      exportedAt: new Date().toISOString(),
      format: "series-tracker.v1",
    };
    await Share.share({ message: JSON.stringify(payload, null, 2) });
  }, [includeEpisodes, state.shows, selected]);

  return (
    <ParallaxScrollView>
      <BackButton />
      {state.shows.length === 0 ? (
        <ThemedText>No shows to export.</ThemedText>
      ) : (
        <ThemedView style={styles.content}>
          <Checkbox
            label="Select all"
            checked={allChecked}
            onValueChange={toggleAll}
          />

          <HorizontalSeparator style={{ marginVertical: 6 }} />
          <Checkbox
            label="Include episodes"
            checked={includeEpisodes}
            onValueChange={setIncludeEpisodes}
          />
          <ThemedText style={[styles.note, { color: mutedTextColor }]}>
            {includeEpisodes
              ? "Episodes will be included in the export."
              : "Episodes are excluded from the export."}
          </ThemedText>

          <HorizontalSeparator style={{ marginVertical: 6 }} />

          {state.shows.map((item, idx) => {
            return (
              <View key={item.imdbId}>
                <Checkbox
                  label={item.title}
                  checked={!!selected[item.imdbId]}
                  onValueChange={(val) =>
                    setSelected((prev) => ({ ...prev, [item.imdbId]: val }))
                  }
                />
                {idx < state.shows.length - 1 && (
                  <HorizontalSeparator style={{ marginVertical: 6 }} />
                )}
              </View>
            );
          })}

          <Pressable
            disabled={!hasAny}
            onPress={onShare}
            style={[
              styles.primaryBtn,
              { backgroundColor: primaryColor },
              !hasAny && styles.disabledBtn,
            ]}
          >
            <ThemedText
              style={[styles.primaryBtnText, { color: onPrimaryColor }]}
            >
              Share JSON
            </ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  content: { gap: 12 },
  list: { maxHeight: 360 },
  separator: { height: 1, marginVertical: 8 },
  note: { opacity: 0.8, fontSize: 12 },
  primaryBtn: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledBtn: { opacity: 0.6 },
  primaryBtnText: { fontWeight: "600" },
});
