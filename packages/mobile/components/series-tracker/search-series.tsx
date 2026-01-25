import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { useOmdbTitleMutation, useSearchSeries } from "@/hooks/use-movies";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { BackButton } from "../back-button";
import { CustomButton } from "../form-elements/custom-button";
import { CustomInput } from "../form-elements/custom-input";
import { VirtualizedList } from "../virtualized-list";
import { OmdbSearchItem, SearchResult } from "./search-result";

type Search = {
  query: string;
};

export const SearchSeries = () => {
  const { state, addShow } = useSeriesTracker();
  const { mutedText: mutedTextColor, danger: dangerColor } = useThemeColor({}, [
    "mutedText",
    "danger",
  ]);

  const form = useForm<Search>({
    defaultValues: { query: "" },
    reValidateMode: "onChange",
    values: { query: "" },
    mode: "onSubmit",
  });

  const query = form.watch("query");

  const { data, isFetching, refetch, error, isError } = useSearchSeries(query, {
    enabled: false,
  });

  const onSubmit = form.handleSubmit(async ({ query }) => {
    if (!query.trim()) return;
    // With enabled auto-managed by the hook, this refetch is optional.
    refetch();
  });

  const { mutateAsync: fetchTitle, isPending } = useOmdbTitleMutation();

  const onAdd = async (item: OmdbSearchItem) => {
    const show = await fetchTitle(item.imdbID);

    if (!show) return;

    await addShow(show);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>
        Find a show
      </ThemedText>

      <BackButton />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Controller
          control={form.control}
          name="query"
          rules={{ required: "Search query is required" }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <CustomInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Search series..."
              returnKeyType="search"
              containerStyle={{ width: "75%" }}
              error={error?.message}
              onSubmitEditing={onSubmit}
            />
          )}
        />

        <CustomButton
          onPress={onSubmit}
          title="Search"
          variant="PRIMARY"
          containerStyle={{
            width: "22%",
            paddingHorizontal: 8,
            borderRadius: 4,
          }}
        />
      </View>

      {isFetching && (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <ThemedText style={[styles.loadingText, { color: mutedTextColor }]}>
            Searching…
          </ThemedText>
        </View>
      )}

      {isError && (
        <ThemedText style={[styles.errorText, { color: dangerColor }]}>
          {error?.message || "Search failed"}
        </ThemedText>
      )}

      <VirtualizedList>
        {((data as OmdbSearchItem[] | undefined) ?? []).map((item) => {
          const isAdded = state.shows.some((s) => s.imdbId === item.imdbID);
          return (
            <SearchResult
              key={item.imdbID}
              item={item}
              onAdd={onAdd}
              isAdded={isAdded}
              isLoading={isPending}
            />
          );
        })}
      </VirtualizedList>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  heading: {
    textAlign: "left",
    marginBottom: 4,
  },
  searchRow: {
    gap: 8,
    flexDirection: "column",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {},
  separator: {
    height: 1,
    opacity: 0.1,
    marginVertical: 8,
  },
  errorText: {
    marginTop: 8,
  },
});
