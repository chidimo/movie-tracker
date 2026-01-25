export { useSeriesTracker } from '@movie-tracker/core';

export const SeriesTrackerProvider = ({ children }: { children: React.ReactNode }) => {
  // This provider would wrap the app with context
  // For now, just render children
  return <>{children}</>;
};
