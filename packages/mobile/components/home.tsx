import { NewUser } from "./new-user";
import { useSeriesTracker } from "@/context/series-tracker-context";
import { SeriesTrackerPage } from "./series-tracker/series-tracker-page";

export const Home = () => {
  const { hasProfile, hasShows } = useSeriesTracker();
  return hasProfile && hasShows ? <SeriesTrackerPage /> : <NewUser />;
};
