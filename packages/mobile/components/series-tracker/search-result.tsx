import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { OmdbSearchItem } from "@movie-tracker/core";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { CustomButton } from "../form-elements/custom-button";
import { ThemedView } from "../themed-view";

export type { OmdbSearchItem } from "@movie-tracker/core";

export const SearchResult = ({
  onAdd,
  item,
  isAdded,
  isLoading,
}: {
  onAdd: (item: OmdbSearchItem) => void;
  item: OmdbSearchItem;
  isAdded: boolean;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const {
    border: borderColor,
    surfaceAlt: surfaceAltColor,
    mutedText: mutedTextColor,
  } = useThemeColor({}, ["border", "surfaceAlt", "mutedText"]);

  const handleViewDetails = () => {
    router.push(`/preview/${item.imdbID}`);
  };

  return (
    <ThemedView
      key={item.imdbID}
      style={[styles.itemRow, { opacity: isAdded ? 0.7 : 1, borderColor }]}
    >
      {item.Poster && item.Poster !== "N/A" ? (
        <Image source={{ uri: item.Poster }} style={styles.poster} />
      ) : (
        <ThemedView
          style={[
            styles.poster,
            styles.posterPlaceholder,
            { backgroundColor: surfaceAltColor },
          ]}
        />
      )}
      <ThemedView style={styles.itemMeta}>
        <ThemedText style={styles.itemTitle}>{item.Title}</ThemedText>
        {!!item.Year && (
          <ThemedText style={[styles.itemYear, { color: mutedTextColor }]}>
            {item.Year}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <CustomButton
          onPress={handleViewDetails}
          title="View Details"
          containerStyle={{
            width: "auto",
            height: 40,
            paddingVertical: 4,
            paddingHorizontal: 8,
            marginRight: 8,
          }}
          variant="SECONDARY"
        />
        <CustomButton
          onPress={() => !isAdded && onAdd(item)}
          title={isAdded ? "Added" : "Add"}
          containerStyle={{
            width: "auto",
            height: 40,
            paddingVertical: 4,
            paddingHorizontal: 8,
          }}
          variant={isAdded ? "SUCCESS" : "PRIMARY"}
          disabled={isAdded || isLoading}
          isLoading={isLoading}
        />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
  },
  poster: {
    width: 50,
    height: 75,
    borderRadius: 6,
  },
  posterPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemMeta: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: "600",
  },
  itemYear: {
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 16,
  },
});
