import { useSeriesTracker } from "@/context/series-tracker-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

type Props = {
  showId: string;
};

export const MoveToTopButton = ({ showId }: Props) => {
  const { moveShowToTop } = useSeriesTracker();
  const { tint: tintColor } = useThemeColor({}, ["tint"]);

  const handleMoveToTop = async () => {
    await moveShowToTop(showId);
  };

  return (
    <Pressable onPress={handleMoveToTop} style={styles.button}>
      <Ionicons name="arrow-up-circle" size={24} color={tintColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 4,
  },
});
