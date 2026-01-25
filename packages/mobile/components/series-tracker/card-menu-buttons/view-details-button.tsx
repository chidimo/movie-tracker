import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

type Props = {
  showId: string;
};

export const ViewDetailsButton = ({ showId }: Props) => {
  const { tint: tintColor } = useThemeColor({}, ["tint"]);

  return (
    <Link href={`/show/${showId}`} asChild>
      <Pressable style={styles.button}>
        <Ionicons name="eye" size={20} color={tintColor} />
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 4,
  },
});
