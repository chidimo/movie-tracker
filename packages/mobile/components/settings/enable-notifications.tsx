import { CustomButton } from "@/components/form-elements/custom-button";
import { ThemedText } from "@/components/themed-text";
import {
  getNotificationPermissionsStatus,
  NotificationPermissionStatus,
  requestNotificationPermissions,
} from "@/lib/notifications";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export const EnableNotifications = () => {
  const [status, setStatus] =
    useState<NotificationPermissionStatus>("undetermined");
  const [loading, setLoading] = useState<boolean>(false);

  const refreshStatus = useCallback(async () => {
    const s = await getNotificationPermissionsStatus();
    setStatus(s);
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const onRequest = useCallback(async () => {
    setLoading(true);
    try {
      const s = await requestNotificationPermissions();
      setStatus(s);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <View style={styles.buttonRow}>
        <CustomButton
          variant="PRIMARY"
          title={
            status === "granted"
              ? "Notifications Enabled"
              : "Enable Notifications"
          }
          onPress={onRequest}
          isLoading={loading}
        />
      </View>
      {status === "unavailable" && (
        <ThemedText style={styles.hint}>
          Notifications module not available. You&apos;re using an unsupported platform.
        </ThemedText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  spaced: {
    marginTop: 8,
    marginBottom: 8,
  },
  buttonRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 12,
  },
  hint: {
    marginTop: 8,
    opacity: 0.7,
  },
});
