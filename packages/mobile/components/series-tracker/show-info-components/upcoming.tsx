"use client";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Show } from "@movie-tracker/core";
import { findUpcomingForShow, formatTentative, getPaddedNumber } from "@movie-tracker/core";

export const UpcomingRibbon = ({
  show,
  className = "",
}: {
  show?: Show;
  className?: string;
}) => {
  const { tint: ribbonBackground, onTint: ribbonText } = useThemeColor({}, [
    "tint",
    "onTint",
  ]);
  const upcoming = findUpcomingForShow(show);
  if (!upcoming) return null;

  const s = getPaddedNumber(upcoming.seasonNumber);
  const e = getPaddedNumber(upcoming.episodeNumber);
  const code = s && e ? `S${s}.E${e}` : "Soon";
  return (
    <ThemedView
      className={className}
      style={{
        backgroundColor: ribbonBackground,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        shadowOpacity: 0.15,
        shadowRadius: 6,
      }}
    >
      <ThemedText style={{ color: ribbonText, fontSize: 10 }}>
        {code}
      </ThemedText>
    </ThemedView>
  );
};

export const UpcomingBanner = ({
  show,
  className = "",
}: {
  show?: Show;
  className?: string;
}) => {
  const {
    surface: bannerBackground,
    border: bannerBorder,
    tint: bannerText,
  } = useThemeColor({}, ["surface", "border", "tint"]);
  const upcoming = findUpcomingForShow(show);
  if (!upcoming) return null;

  const dateStr = new Date(upcoming.dateISO).toISOString();
  const padSeason = getPaddedNumber(upcoming.seasonNumber);
  const padEpisode = getPaddedNumber(upcoming.episodeNumber);
  const code =
    padSeason && padEpisode ? `S${padSeason}.E${padEpisode}` : undefined;
  const title = upcoming.title || "Upcoming episode";

  return (
    <ThemedView
      className={className}
      style={{
        alignSelf: "flex-start",
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: bannerBorder,
        backgroundColor: bannerBackground,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <ThemedText style={{ fontWeight: "600", color: bannerText }}>
        Upcoming:
      </ThemedText>
      {code ? (
        <ThemedText style={{ fontFamily: "monospace", marginRight: 4 }}>
          {code}
        </ThemedText>
      ) : null}
      <ThemedText>{`${title} – ${formatTentative(dateStr)}`}</ThemedText>
    </ThemedView>
  );
};
