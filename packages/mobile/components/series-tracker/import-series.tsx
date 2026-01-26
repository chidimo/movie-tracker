import { Checkbox } from "@/components/form-elements/checkbox";
import { ThemedText } from "@/components/themed-text";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useClipboard } from "@/hooks/use-clipboard";
import { useThemeColor } from "@/hooks/use-theme-color";
import { normalizeShowTransfer } from "@movie-tracker/core";
import { importShows } from "@/lib/import-utils";
import type { Show } from "@movie-tracker/core";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import { BackButton } from "../back-button";
import { CustomButton } from "../form-elements/custom-button";
import { HorizontalSeparator } from "../horizontal-separator";
import ParallaxScrollView from "../parallax-scroll-view";
import { ImportItem } from "./import-item";

export const ImportSeries = () => {
  const { fetchCopiedText } = useClipboard();
  const { state, replaceState } = useSeriesTracker();
  const {
    background: inputBackground,
    text: inputTextColor,
    border: inputBorderColor,
    mutedText: placeholderColor,
    danger: dangerColor,
  } = useThemeColor({}, [
    "background",
    "text",
    "border",
    "mutedText",
    "danger",
  ]);
  const [pasted, setPasted] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [importedShows, setImportedShows] = useState<Partial<Show>[]>([]);
  const [importSelected, setImportSelected] = useState<Record<string, boolean>>(
    {},
  );
  const [includeEpisodes, setIncludeEpisodes] = useState(false);

  const maxTextareaHeight = useMemo(
    () => Dimensions.get("window").height / 6,
    [],
  );

  const onParse = useCallback(() => {
    try {
      setParsing(true);
      setError(undefined);
      const json = JSON.parse(pasted || "{}");
      let shows: any[] = [];
      if (Array.isArray(json?.shows)) {
        shows = json.shows;
      } else if (Array.isArray(json)) {
        shows = json;
      }
      const normalized: Partial<Show>[] = shows.map((s: any) =>
        normalizeShowTransfer(s, { includeEpisodes }),
      );
      const sel: Record<string, boolean> = {};
      for (const s of normalized)
        if (s.imdbId) {
          sel[s.imdbId] = true;
        }
      setImportedShows(normalized);
      setImportSelected(sel);
    } catch {
      setError("Invalid JSON. Paste an export from this app.");
      setImportedShows([]);
      setImportSelected({});
    } finally {
      setParsing(false);
    }
  }, [includeEpisodes, pasted]);

  const toggleAll = useCallback(
    (checked: boolean) => {
      const sel: Record<string, boolean> = {};
      for (const s of importedShows) if (s.imdbId) sel[s.imdbId] = checked;
      setImportSelected(sel);
    },
    [importedShows],
  );

  const canImport = useMemo(
    () => importedShows.some((s) => s.imdbId && importSelected[s.imdbId]),
    [importedShows, importSelected],
  );

  const onConfirm = useCallback(async () => {
    const nextState = importShows(state, importedShows, importSelected, {
      includeEpisodes,
    });
    await replaceState(nextState);
    // Navigate back to Home tab after import completes
    setPasted("");
    router.navigate("/");
  }, [state, importedShows, importSelected, replaceState, includeEpisodes]);

  const onPaste = useCallback(async () => {
    try {
      await fetchCopiedText((text: string) => {
        if (typeof text === "string") setPasted(text);
      });
    } catch {
      // no-op
    }
  }, [fetchCopiedText]);

  return (
    <ParallaxScrollView>
      <BackButton />
      <ThemedText>Paste your JSON export below and tap Parse.</ThemedText>
      <TextInput
        style={[
          styles.textarea,
          { maxHeight: maxTextareaHeight },
          {
            backgroundColor: inputBackground,
            color: inputTextColor,
            borderColor: inputBorderColor,
          },
        ]}
        value={pasted}
        onChangeText={setPasted}
        placeholder="Paste JSON here"
        placeholderTextColor={placeholderColor}
        multiline
        textAlignVertical="top"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.actionsRow}>
        <CustomButton
          onPress={onPaste}
          variant="CANCEL"
          title="Paste"
          containerStyle={{ width: "45%" }}
        />
        <CustomButton
          onPress={onParse}
          variant="CANCEL"
          title="Parse"
          containerStyle={{ width: "45%" }}
          isLoading={parsing}
        />
      </View>

      {error ? (
        <ThemedText style={[styles.error, { color: dangerColor }]}>
          {error}
        </ThemedText>
      ) : null}

      {importedShows.length === 0 ? null : (
        <View style={styles.results}>
          <View style={styles.selectAllRow}>
            <Checkbox
              label="Select all"
              checked={importedShows.every(
                (s) => s.imdbId && importSelected[s.imdbId],
              )}
              onValueChange={toggleAll}
            />
          </View>

          <HorizontalSeparator style={{ marginVertical: 6 }} />
          <Checkbox
            label="Import episodes"
            checked={includeEpisodes}
            onValueChange={setIncludeEpisodes}
          />
          <HorizontalSeparator style={{ marginVertical: 6 }} />
          {importedShows.map((item) => {
            if (!item.imdbId) {
              return null;
            }
            const id = item.imdbId;
            return (
              <View key={id}>
                <ImportItem
                  key={id}
                  show={item}
                  itemChecked={!!importSelected[id]}
                  onItemCheckChanged={(checked) =>
                    setImportSelected((prev) => ({
                      ...prev,
                      [id]: !!checked,
                    }))
                  }
                />
                <HorizontalSeparator style={{ marginVertical: 6 }} />
              </View>
            );
          })}

          <CustomButton
            onPress={onConfirm}
            variant="PRIMARY"
            title="Import Selected"
            disabled={!canImport}
          />
        </View>
      )}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  textarea: {
    minHeight: 160,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  error: {},
  results: { gap: 12 },
  selectAllRow: { marginTop: 8 },
  loadingRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  list: { maxHeight: 320 },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionBtnGrow: {
    flex: 1,
  },
});
