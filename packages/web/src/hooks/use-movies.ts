export const useOmdbTitleMutation = () => {
  return { mutate: () => {}, isPending: false };
};

export const useSearchSeries = () => {
  return { data: [], isLoading: false, error: null };
};
