import React from "react";
import { StyleSheet, View } from "react-native";
import { CustomButton } from "../form-elements/custom-button";
import { DefaultModal } from "../modal";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type ConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  open,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <DefaultModal title="Remove show?" visible={open} onRequestClose={onCancel}>
      <ThemedView style={styles.container}>
        <ThemedText>
          This will remove the show from your list on this device. You can add
          it again later.
        </ThemedText>

        <View style={styles.actions}>
          <CustomButton
            title="Cancel"
            onPress={onCancel}
            variant="SECONDARY"
            containerStyle={{ width: "auto", paddingHorizontal: 8 }}
          />

          <CustomButton
            title="Confirm"
            onPress={onConfirm}
            variant="DANGER"
            containerStyle={{ width: "auto", paddingHorizontal: 8 }}
          />
        </View>
      </ThemedView>
    </DefaultModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 16,
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
