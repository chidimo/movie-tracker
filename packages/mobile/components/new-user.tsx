import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SetupProfile } from "./user/setup-profile";
import { Welcome } from "./welcome";

export const NewUser = () => {
  const router = useRouter();
  const { state, hasShows } = useSeriesTracker();
  const hasProfile = !!state.profile?.name;
  const { border: borderColor, success: successColor } = useThemeColor({}, [
    "border",
    "success",
  ]);

  const handlePressSearch = () => {
    if (!hasProfile) {
      return;
    }
    router.push("/search");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.surface,
        dark: Colors.dark.surfaceAlt,
      }}
      headerImage={
        <Image
          source={require("@/assets/images/popcorn-time.png")}
          style={[styles.reactLogo, { borderColor }]}
        />
      }
    >
      <Welcome />
      <SetupProfile />

      <Pressable onPress={handlePressSearch}>
        <ThemedView
          style={[
            styles.stepContainer,
            {
              opacity: hasProfile ? 1 : 0.5,
              pointerEvents: hasProfile ? "auto" : "none",
            },
          ]}
        >
          <ThemedView style={styles.stepHeaderRow}>
            <ThemedText type="subtitle">
              Step 2: Search and add shows
            </ThemedText>
            {hasShows ? (
              <ThemedText style={{ color: successColor }}>✓</ThemedText>
            ) : null}
          </ThemedView>
          <ThemedText>
            Search for shows to add to your tracker or import from a previous
            export
          </ThemedText>
        </ThemedView>
      </Pressable>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  stepHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
