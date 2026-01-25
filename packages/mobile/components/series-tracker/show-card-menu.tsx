import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";

type Props = {
  showId: string;
  showTitle: string;
};

export const ShowCardMenu = ({ showId, showTitle }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { moveShowToTop } = useSeriesTracker();
  const { background: backgroundColor, border: borderColor } = useThemeColor(
    {},
    ["background", "border"],
  );

  const handleMoveToTop = async () => {
    await moveShowToTop(showId);
    setMenuVisible(false);
  };

  const menuItems = [
    {
      icon: "arrow-up" as const,
      title: "Move to Top",
      onPress: handleMoveToTop,
    },
    {
      icon: "close" as const,
      title: "Cancel",
      onPress: () => setMenuVisible(false),
    },
  ];

  return (
    <>
      <Pressable onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </Pressable>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <ThemedView
            style={[styles.menuContainer, { backgroundColor, borderColor }]}
            onStartShouldSetResponder={() => true}
          >
            <ThemedText style={styles.menuTitle}>{showTitle}</ThemedText>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color="#666"
                  style={styles.menuIcon}
                />
                <ThemedText style={styles.menuItemText}>
                  {item.title}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 4,
    borderRadius: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    borderRadius: 8,
    padding: 16,
    minWidth: 200,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
  },
});
