import { useOnOffSwitch } from "@/hooks/use-on-off-switch";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Show } from "@movie-tracker/core";
import { Pressable, StyleSheet } from "react-native";
import { DefaultModal } from "../modal";
import { ThemedText } from "../themed-text";
import { ScheduleForm } from "./schedule-form";

export const ScheduleSetter = ({ show }: { show: Show }) => {
  const { isOn, setOn, setOff } = useOnOffSwitch();
  const { tint: linkColor } = useThemeColor({}, ["tint"]);

  const openScheduleModal = () => {
    if (!show) return;
    setOn();
  };

  return (
    <>
      <Pressable onPress={openScheduleModal}>
        <ThemedText style={[styles.link, { color: linkColor }]}>
          Set schedule
        </ThemedText>
      </Pressable>

      <DefaultModal
        visible={isOn}
        title="Set schedule"
        onRequestClose={setOff}
        modalBehavior="fade-into-view"
      >
        <ScheduleForm show={show} onClose={setOff} />
      </DefaultModal>
    </>
  );
};

const styles = StyleSheet.create({
  link: {},
});
