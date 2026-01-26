import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useImageWithFallback } from "@/hooks/use-image-with-fallback";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Show } from "@movie-tracker/core";
import { CardMenu } from "./card-menu";
import {
  CastDisplay,
  RatingsDisplay,
  SeriesProgress,
} from "./show-info-components";

const DetailLink = ({
  imdbId,
  children,
}: {
  imdbId: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={{
        pathname: "/show/[imdbId]",
        params: { imdbId },
      }}
      asChild
    >
      <Pressable>{children}</Pressable>
    </Link>
  );
};

type Props = {
  show: Show;
};

export const ShowCard = ({ show }: Props) => {
  const {
    tint: tintColor,
    border: borderColor,
    success: successColor,
    mutedText: mutedTextColor,
  } = useThemeColor({}, ["tint", "border", "success", "mutedText"]);

  const isUpcomingSoon = show?.nextAirDate
    ? Date.now() + 7 * 24 * 60 * 60 * 1000 >=
      new Date(show.nextAirDate).getTime()
    : false;

  const hasThumbnail = show.thumbnail && show.thumbnail !== "N/A";

  const { imageSource, handleImageError } = useImageWithFallback({
    imageUrl: hasThumbnail ? show.thumbnail : undefined,
    fallbackImage: require("@/assets/images/popcorn-time.png"),
  });

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <View style={styles.cardHeader}>
        <View style={styles.row}>
          <DetailLink imdbId={show?.imdbId}>
            <Image
              source={imageSource}
              style={styles.poster}
              onError={handleImageError}
            />
          </DetailLink>

          <View style={{ flex: 1 }}>
            <DetailLink imdbId={show?.imdbId}>
              <ThemedText
                type="link"
                style={[styles.title, { color: tintColor }]}
              >
                {show?.title}
              </ThemedText>
            </DetailLink>
            {show?.releaseYear ? (
              <ThemedText style={[styles.year, { color: mutedTextColor }]}>
                {show.releaseYear}
              </ThemedText>
            ) : null}

            {!!show?.plot && (
              <ThemedText numberOfLines={3} style={styles.plot}>
                {show.plot}
              </ThemedText>
            )}

            <CastDisplay cast={show?.mainCast} />
            <RatingsDisplay rating={show.rating} votes={show.votes} />
            <SeriesProgress
              seriesId={show?.imdbId || ""}
              label="Overall progress"
            />

            {show?.nextAirDate && (
              <ThemedText
                style={[
                  styles.nextAir,
                  { color: isUpcomingSoon ? successColor : mutedTextColor },
                ]}
              >
                Next air date: {new Date(show.nextAirDate).toLocaleDateString()}
              </ThemedText>
            )}
          </View>
        </View>
        <View style={styles.cardActions}>
          <CardMenu showId={show?.imdbId || ""} showTitle={show?.title || ""} />
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardActions: {
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  poster: {
    width: 64,
    height: 96,
    borderRadius: 8,
  },
  posterPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  year: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  plot: {
    fontSize: 12,
    marginTop: 6,
  },
  nextAir: {
    marginTop: 6,
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
});
