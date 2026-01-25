import { useCallback, useEffect, useState } from "react";

import {
  getCachedThemePreference,
  isThemePreferenceLoaded,
  loadThemePreference,
  setThemePreference,
  subscribeThemePreference,
  type ThemePreference,
} from "@/lib/theme-preference";

export const useThemePreference = () => {
  const [preference, setPreference] = useState<ThemePreference>(
    getCachedThemePreference()
  );

  useEffect(() => {
    if (!isThemePreferenceLoaded()) {
      loadThemePreference().catch(() => {
        // no-op
      });
    }
    return subscribeThemePreference(setPreference);
  }, []);

  const updatePreference = useCallback(
    (value: ThemePreference) => setThemePreference(value),
    []
  );

  return { preference, setPreference: updatePreference };
};
