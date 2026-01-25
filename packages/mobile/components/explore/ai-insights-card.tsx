import { CustomButton } from "@/components/form-elements/custom-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";

interface AIInsights {
  description?: string;
  themes?: string[];
  whyLove?: string;
  perfectFor?: string;
  complexity?: string;
}

interface AIInsightsCardProps {
  aiInsights: AIInsights | undefined;
  isLoadingInsights: boolean;
  onFindSimilar: () => void;
  discoveryQuery: string;
}

export const AIInsightsCard = ({
  aiInsights,
  isLoadingInsights,
  onFindSimilar,
  discoveryQuery,
}: AIInsightsCardProps) => {
  const { mutedText: mutedTextColor, surface: surfaceColor } = useThemeColor(
    {},
    ["mutedText", "surface"],
  );

  const renderInsightDetails = () => (
    <View style={styles.insightContent}>
      <ThemedText style={styles.insightDescription}>
        {aiInsights?.description || "No description available"}
      </ThemedText>

      <View style={styles.insightSection}>
        <ThemedText style={styles.insightLabel}>🎯 Key Themes:</ThemedText>
        <View style={styles.themesContainer}>
          {(aiInsights?.themes || []).map((theme: string) => (
            <View key={`theme-${theme}`} style={styles.themePill}>
              <ThemedText style={styles.themeText}>{theme}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.insightSection}>
        <ThemedText style={styles.insightLabel}>
          ❤️ Why Viewers Love It:
        </ThemedText>
        <ThemedText style={styles.insightText}>
          {aiInsights?.whyLove || "No information available"}
        </ThemedText>
      </View>

      <View style={styles.insightSection}>
        <ThemedText style={styles.insightLabel}>👥 Perfect For:</ThemedText>
        <ThemedText style={styles.insightText}>
          {aiInsights?.perfectFor || "No information available"}
        </ThemedText>
      </View>

      <View style={styles.insightSection}>
        <ThemedText style={styles.insightLabel}>🧩 Complexity:</ThemedText>
        <ThemedText style={styles.insightText}>
          {aiInsights?.complexity || "Unknown"}
        </ThemedText>
      </View>

      <CustomButton
        title="Find Similar Shows"
        variant="SECONDARY"
        onPress={onFindSimilar}
        containerStyle={styles.similarButton}
      />
    </View>
  );

  if (!aiInsights && !isLoadingInsights) return null;

  let insightContent;
  if (isLoadingInsights) {
    insightContent = (
      <ThemedText style={{ color: mutedTextColor }}>
        Analyzing series…
      </ThemedText>
    );
  } else if (aiInsights) {
    insightContent = renderInsightDetails();
  } else {
    insightContent = null;
  }

  return (
    <ThemedView style={[styles.insightCard, { backgroundColor: surfaceColor }]}>
      <ThemedText type="default" style={styles.insightTitle}>
        🧠 AI Insights
      </ThemedText>

      {insightContent}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  insightCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  insightContent: {
    gap: 12,
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  insightSection: {
    gap: 6,
  },
  insightLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  insightText: {
    fontSize: 13,
    opacity: 0.9,
  },
  themesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  themePill: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeText: {
    fontSize: 11,
    color: "#007AFF",
  },
  similarButton: {
    marginTop: 8,
  },
});
