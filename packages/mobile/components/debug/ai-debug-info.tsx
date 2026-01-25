import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet, View } from "react-native";

export const AIDebugInfo = () => {
  const config = {
    baseUrl: process.env.EXPO_PUBLIC_AI_BASE_URL || "Not set",
    model: process.env.EXPO_PUBLIC_AI_MODEL || "Not set",
    hasGroqKey: !!process.env.EXPO_PUBLIC_GROQ_API_KEY,
    debugMode: process.env.EXPO_PUBLIC_DEBUG_AI === "true",
    recommendationCount:
      process.env.EXPO_PUBLIC_AI_RECOMMENDATION_COUNT || "Not set",
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">AI Debug Info</ThemedText>

      <View style={styles.infoRow}>
        <ThemedText style={styles.label}>Base URL:</ThemedText>
        <ThemedText style={styles.value}>{config.baseUrl}</ThemedText>
      </View>

      <View style={styles.infoRow}>
        <ThemedText style={styles.label}>Model:</ThemedText>
        <ThemedText style={styles.value}>{config.model}</ThemedText>
      </View>

      <View style={styles.infoRow}>
        <ThemedText style={styles.label}>Has Groq Key:</ThemedText>
        <ThemedText style={styles.value}>
          {config.hasGroqKey ? "Yes" : "No"}
        </ThemedText>
      </View>

      <View style={styles.infoRow}>
        <ThemedText style={styles.label}>Debug Mode:</ThemedText>
        <ThemedText style={styles.value}>
          {config.debugMode ? "Enabled" : "Disabled"}
        </ThemedText>
      </View>

      <View style={styles.infoRow}>
        <ThemedText style={styles.label}>Recommendation Count:</ThemedText>
        <ThemedText style={styles.value}>
          {config.recommendationCount}
        </ThemedText>
      </View>

      <ThemedText style={styles.note}>
        Add EXPO_PUBLIC_DEBUG_AI=&quot;true&quot; to your .env file to enable AI
        logging in production
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  label: {
    fontWeight: "bold",
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: "right",
  },
  note: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    fontStyle: "italic",
  },
});
