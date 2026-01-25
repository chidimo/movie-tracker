import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, StyleSheet } from "react-native";

export const PressablePill = ({
  text,
  emoji,
  selected,
  onPress,
}: {
  text: string;
  emoji: string;
  selected: boolean;
  onPress: () => void;
}) => {
  const { surface: surfaceColor } = useThemeColor({}, ["surface"]);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.moodPill,
        { backgroundColor: surfaceColor },
        selected && styles.selectedMood,
      ]}
    >
      <ThemedText style={styles.moodEmoji}>{emoji}</ThemedText>
      <ThemedText style={styles.moodLabel}>{text}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  moodPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectedMood: {
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
