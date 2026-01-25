import { useSeriesTracker } from "@/context/series-tracker-context";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { HelloWave } from "@/components/hello-wave";

export const Welcome = () => {
  const { state } = useSeriesTracker();

  return (
    <ThemedView
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <ThemedText type="title">
        {state.profile?.name ? `${state.profile.name}!` : "Welcome!"}
      </ThemedText>
      <HelloWave />
    </ThemedView>
  );
};
