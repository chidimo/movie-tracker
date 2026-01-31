import { NewUser } from './new-user'
import { SeriesTrackerPage } from './series-tracker/series-tracker-page'
import { useSeriesTracker } from '@/context/series-tracker-context'

export const Home = () => {
  const { hasProfile, hasShows } = useSeriesTracker()
  return hasProfile && hasShows ? <SeriesTrackerPage /> : <NewUser />
}
