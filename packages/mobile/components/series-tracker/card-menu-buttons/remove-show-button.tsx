"use client";

import { useSeriesTracker } from "@/context/series-tracker-context";
import { useOnOffSwitch } from "@/hooks/use-on-off-switch";
import { useState } from "react";
import { CustomButton } from "../../form-elements/custom-button";
import { ConfirmModal } from "../confirm-modal";

export const RemoveShowButton = ({ showId }: { showId: string }) => {
  const { removeShow } = useSeriesTracker();
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const { isOn, setOn, setOff } = useOnOffSwitch();

  const requestRemove = (imdbId: string) => {
    setPendingRemoveId(imdbId);
    setOn();
  };

  const confirmRemove = () => {
    if (pendingRemoveId) {
      removeShow(pendingRemoveId);
    }
    setOff();
    setPendingRemoveId(null);
  };

  const handleRemove = () => {
    requestRemove(showId);
  };

  return (
    <>
      <CustomButton
        variant="DANGER"
        onPress={handleRemove}
        title="Remove"
        containerStyle={{
          width: "auto",
          height: 40,
          paddingVertical: 4,
          paddingHorizontal: 8,
        }}
      />

      <ConfirmModal
        open={isOn}
        onConfirm={confirmRemove}
        onCancel={() => {
          setOff();
          setPendingRemoveId(null);
        }}
      />
    </>
  );
};
