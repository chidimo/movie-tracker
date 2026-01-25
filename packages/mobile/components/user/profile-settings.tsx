import { ThemedText } from "@/components/themed-text";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useOnOffSwitch } from "@/hooks/use-on-off-switch";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, StyleSheet, View } from "react-native";
import { ProfileFormModal } from "./profile-form-modal";

export const ProfileSettings = () => {
  const { hasProfile, state } = useSeriesTracker();
  const { success: successColor } = useThemeColor({}, ["success"]);
  const { isOn, setOn, setOff } = useOnOffSwitch();

  const profileName = state?.profile?.name || "Not set";

  return (
    <View style={styles.container}>
      <Pressable onPress={setOn}>
        <View style={styles.profileHeader}>
          <ThemedText type="subtitle">Profile</ThemedText>
          {hasProfile && (
            <ThemedText style={{ color: successColor }}>✓</ThemedText>
          )}
        </View>
        <ThemedText style={styles.profileInfo}>
          Current name: {profileName}
        </ThemedText>
        <ThemedText style={styles.description}>Update your name</ThemedText>
      </Pressable>

      <ProfileFormModal
        visible={isOn}
        onRequestClose={setOff}
        title="Edit your profile"
        helpText="Update your profile information"
        submitButtonText="Update"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  profileInfo: {
    marginBottom: 4,
  },
  description: {
    opacity: 0.7,
  },
});
